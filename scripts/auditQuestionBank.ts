/**
 * Audit question_bank_master.csv: integrity, structure, and statistics.
 * Run: npx tsx scripts/auditQuestionBank.ts
 * Does NOT modify the file.
 */

import * as fs from "fs";
import * as path from "path";

const CSV_PATH = path.join(process.cwd(), "data", "question_bank_master.csv");
const EXPECTED_HEADER = "category,trait,sub_area,question_text,reverse_scored,weight,test_type,age_group";

interface RowResult {
  lineNo: number;
  raw: string;
  cols: string[];
  valid: boolean;
  errors: string[];
}

function parseLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      inQuotes = !inQuotes;
    } else if ((c === "," && !inQuotes) || c === "\r") {
      result.push(current.trim());
      current = "";
    } else if (c !== "\r") {
      current += c;
    }
  }
  result.push(current.trim());
  // Trim trailing empty columns (e.g. from trailing comma)
  while (result.length > 0 && result[result.length - 1] === "") result.pop();
  return result;
}

function audit(): void {
  const content = fs.readFileSync(CSV_PATH, "utf-8");
  const lines = content.split(/\n/).filter((l) => l.length > 0 || l === ""); // keep empty lines to report line numbers
  const nonEmptyLines = content.split(/\n/);

  // 1. Header
  const headerLine = (nonEmptyLines[0] ?? "").replace(/^\uFEFF/, "").trim();
  const headerValid = headerLine === EXPECTED_HEADER;

  const dataLines = nonEmptyLines.slice(1).filter((l) => l.trim().length > 0);
  const totalRows = dataLines.length;

  const rowResults: RowResult[] = [];
  const categoryCount: Record<string, number> = {};
  const traitCount: Record<string, number> = {};
  const testTypeCount: Record<string, number> = {};
  const ageGroupCount: Record<string, number> = {};
  const questionTextToRows: Record<string, number[]> = {};
  let emptyFieldCount = 0;
  let invalidRows = 0;

  for (let i = 0; i < dataLines.length; i++) {
    const line = dataLines[i];
    const lineNo = i + 2; // 1-based, +1 for header
    const rawCols = parseLine(line);
    const errors: string[] = [];

    let category: string, trait: string, sub_area: string, question_text: string, reverse_scored: string, weight: string, test_type: string, age_group: string;
    if (rawCols.length >= 8) {
      category = rawCols[0];
      trait = rawCols[1];
      sub_area = rawCols[2];
      question_text = rawCols.length === 8 ? rawCols[3] : rawCols.slice(3, rawCols.length - 4).join(",");
      reverse_scored = rawCols[rawCols.length - 4];
      weight = rawCols[rawCols.length - 3];
      test_type = rawCols[rawCols.length - 2];
      age_group = rawCols[rawCols.length - 1];
      // When rawCols.length > 8, question_text contains commas; we merged to 8 logical columns (no error)
    } else {
      category = rawCols[0] ?? "";
      trait = rawCols[1] ?? "";
      sub_area = rawCols[2] ?? "";
      question_text = rawCols[3] ?? "";
      reverse_scored = rawCols[4] ?? "";
      weight = rawCols[5] ?? "";
      test_type = rawCols[6] ?? "";
      age_group = rawCols[7] ?? "";
      errors.push(`Expected at least 8 columns, got ${rawCols.length}`);
    }

    if (!category?.trim()) {
      errors.push("Empty category");
      emptyFieldCount++;
    }
    if (!trait?.trim()) {
      errors.push("Empty trait");
      emptyFieldCount++;
    }
    if (!sub_area?.trim()) {
      errors.push("Empty sub_area");
      emptyFieldCount++;
    }
    if (!question_text?.trim()) {
      errors.push("Missing or empty question_text");
      emptyFieldCount++;
    }
    if (reverse_scored !== undefined && reverse_scored !== null) {
      const rs = reverse_scored.toLowerCase().trim();
      if (rs !== "true" && rs !== "false") {
        errors.push(`Invalid reverse_scored: "${reverse_scored}" (must be true or false)`);
      }
    } else {
      errors.push("Empty reverse_scored");
      emptyFieldCount++;
    }
    const weightNum = weight?.trim() === "" ? NaN : parseInt(weight, 10);
    if (Number.isNaN(weightNum) || String(weightNum) !== String(weight).trim()) {
      errors.push(`Invalid weight: "${weight}" (must be integer)`);
    }
    if (test_type !== undefined && test_type !== null) {
      const tt = test_type.toLowerCase().trim();
      if (tt !== "rapid" && tt !== "deep") {
        errors.push(`Invalid test_type: "${test_type}" (must be rapid or deep)`);
      }
    } else {
      errors.push("Empty test_type");
      emptyFieldCount++;
    }
    if (!age_group?.trim()) {
      errors.push("Empty age_group");
      emptyFieldCount++;
    }

    if (question_text?.trim()) {
      const key = question_text.trim();
      if (!questionTextToRows[key]) questionTextToRows[key] = [];
      questionTextToRows[key].push(lineNo);
    }

    if (errors.length > 0) invalidRows++;
    rowResults.push({ lineNo, raw: line, cols: [category, trait, sub_area, question_text, reverse_scored, weight, test_type, age_group], valid: errors.length === 0, errors });

    if (category?.trim()) categoryCount[category] = (categoryCount[category] || 0) + 1;
    if (trait?.trim()) traitCount[trait] = (traitCount[trait] || 0) + 1;
    if (test_type?.trim()) testTypeCount[test_type.trim().toLowerCase()] = (testTypeCount[test_type.trim().toLowerCase()] || 0) + 1;
    if (age_group?.trim()) ageGroupCount[age_group] = (ageGroupCount[age_group] || 0) + 1;
  }

  const duplicateTexts = Object.entries(questionTextToRows).filter(([, rows]) => rows.length > 1);
  const duplicateQuestionCount = duplicateTexts.reduce((sum, [, rows]) => sum + rows.length, 0);

  // Report
  console.log("\n========== QUESTION BANK AUDIT ==========\n");
  console.log("Total questions:", totalRows);
  console.log("Duplicate questions (by question_text):", duplicateQuestionCount);
  console.log("Invalid rows:", invalidRows);
  console.log("Empty fields (total occurrences):", emptyFieldCount);
  console.log("");

  console.log("Header valid:", headerValid ? "YES" : "NO");
  if (!headerValid) {
    console.log("  Expected:", EXPECTED_HEADER);
    console.log("  Got:", headerLine || "(empty)");
  }
  console.log("");

  console.log("Distribution by category:");
  const catEntries = Object.entries(categoryCount).sort((a, b) => b[1] - a[1]);
  for (const [k, v] of catEntries) console.log(`  ${k}: ${v}`);
  console.log("");

  console.log("Distribution by trait:");
  const traitEntries = Object.entries(traitCount).sort((a, b) => b[1] - a[1]);
  for (const [k, v] of traitEntries) console.log(`  ${k}: ${v}`);
  console.log("");

  console.log("Distribution by test type:");
  for (const [k, v] of Object.entries(testTypeCount).sort((a, b) => b[1] - a[1])) console.log(`  ${k}: ${v}`);
  console.log("");

  console.log("Distribution by age group:");
  for (const [k, v] of Object.entries(ageGroupCount).sort((a, b) => b[1] - a[1])) console.log(`  ${k}: ${v}`);
  console.log("");

  // Distribution checks
  const hasRapid = (testTypeCount["rapid"] || 0) > 0;
  const hasDeep = (testTypeCount["deep"] || 0) > 0;
  const ageGroups = Object.keys(ageGroupCount).length;
  console.log("Distribution validation:");
  console.log("  Both rapid and deep exist:", hasRapid && hasDeep ? "YES" : "NO");
  console.log("  Multiple age groups exist:", ageGroups >= 2 ? "YES" : "NO");
  console.log("");

  if (duplicateTexts.length > 0) {
    console.log("Duplicate question_text (row numbers):");
    for (const [text, rows] of duplicateTexts.slice(0, 20)) {
      console.log(`  Rows ${rows.join(", ")}: "${text.slice(0, 50)}..."`);
    }
    if (duplicateTexts.length > 20) console.log(`  ... and ${duplicateTexts.length - 20} more duplicate sets`);
    console.log("");
  }

  const invalidRowResults = rowResults.filter((r) => !r.valid);
  if (invalidRowResults.length > 0) {
    console.log("Invalid rows (line number and problems):");
    for (const r of invalidRowResults) {
      console.log(`  Line ${r.lineNo}: ${r.errors.join("; ")}`);
    }
  }

  console.log("\n========== END AUDIT ==========\n");
}

audit();

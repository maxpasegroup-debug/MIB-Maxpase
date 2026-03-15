/**
 * Career Intelligence Report — PDF document for @react-pdf/renderer.
 * Use with PDFDownloadLink or pdf().toBlob() in a client component.
 * Watermark: MIB, opacity 0.05, fontSize 160, rotate -30deg, centered.
 */

import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
} from "@react-pdf/renderer";

export interface CareerReportPDFData {
  archetype: string;
  description: string;
  careerIndex: number;
  cluster: string;
  dimensionScores: { label: string; value: number }[];
  potentialScores: { label: string; value: number }[];
  gapAnalysis: { dimension: string; gap: number }[];
  probabilities: { career: string; probability: number }[];
  roadmap: { step: number; title: string; description: string }[];
  aiReport: string;
}

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 11,
  },
  watermark: {
    position: "absolute",
    top: "50%",
    left: "50%",
    opacity: 0.05,
    fontSize: 160,
    color: "#000",
    transform: "rotate(-30deg)",
    // Offset so center of text is at page center (approx)
    marginLeft: -120,
    marginTop: -80,
  },
  section: {
    marginBottom: 16,
  },
  h1: {
    fontSize: 22,
    marginBottom: 8,
    color: "#374151",
  },
  h2: {
    fontSize: 14,
    marginBottom: 6,
    color: "#4b5563",
  },
  body: {
    fontSize: 10,
    marginBottom: 4,
    color: "#6b7280",
    lineHeight: 1.5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
});

function Watermark() {
  return (
    <View style={styles.watermark}>
      <Text>MIB</Text>
    </View>
  );
}

export function CareerReportPDFDocument({ data }: { data: CareerReportPDFData }) {
  return (
    <Document>
      {/* Cover Page */}
      <Page size="A4" style={styles.page}>
        <Watermark />
        <View style={styles.section}>
          <Text style={styles.h1}>Career Intelligence Report</Text>
          <Text style={styles.body}>10D career profile — confidential</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.h2}>Identity</Text>
          <Text style={styles.body}>{data.archetype}</Text>
          <Text style={styles.body}>{data.description}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.h2}>Career Intelligence Index</Text>
          <Text style={styles.body}>{data.careerIndex} / 100</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.h2}>Primary Career Cluster</Text>
          <Text style={styles.body}>{data.cluster}</Text>
        </View>
      </Page>

      {/* 10D Radar (scores as list) */}
      <Page size="A4" style={styles.page}>
        <Watermark />
        <Text style={styles.h1}>10D Intelligence Profile</Text>
        {data.dimensionScores.map((d, i) => (
          <View key={i} style={styles.row}>
            <Text style={styles.body}>{d.label}</Text>
            <Text style={styles.body}>{d.value}</Text>
          </View>
        ))}
      </Page>

      {/* Potential Profile */}
      <Page size="A4" style={styles.page}>
        <Watermark />
        <Text style={styles.h1}>Potential Profile</Text>
        {data.potentialScores.map((d, i) => (
          <View key={i} style={styles.row}>
            <Text style={styles.body}>{d.label}</Text>
            <Text style={styles.body}>{Math.round(d.value)}</Text>
          </View>
        ))}
      </Page>

      {/* Gap Analysis + Probabilities */}
      <Page size="A4" style={styles.page}>
        <Watermark />
        <Text style={styles.h1}>Behavioral Gap Analysis</Text>
        {data.gapAnalysis.slice(0, 10).map((g, i) => (
          <View key={i} style={styles.row}>
            <Text style={styles.body}>{g.dimension}</Text>
            <Text style={styles.body}>+{g.gap}</Text>
          </View>
        ))}
        <Text style={[styles.h1, { marginTop: 20 }]}>Career Probabilities</Text>
        {data.probabilities.slice(0, 8).map((p, i) => (
          <View key={i} style={styles.row}>
            <Text style={styles.body}>{p.career}</Text>
            <Text style={styles.body}>{p.probability}%</Text>
          </View>
        ))}
      </Page>

      {/* Life Path + Roadmap */}
      <Page size="A4" style={styles.page}>
        <Watermark />
        <Text style={styles.h1}>Life Path & Career Roadmap</Text>
        {data.roadmap.map((s, i) => (
          <View key={i} style={styles.section}>
            <Text style={styles.body}>{s.step}. {s.title}</Text>
            {s.description ? <Text style={styles.body}>   {s.description}</Text> : null}
          </View>
        ))}
      </Page>

      {/* AI Strategic Insight */}
      <Page size="A4" style={styles.page}>
        <Watermark />
        <Text style={styles.h1}>Strategic AI Insight</Text>
        <Text style={styles.body}>{data.aiReport}</Text>
      </Page>
    </Document>
  );
}

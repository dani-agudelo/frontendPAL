import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { ReportData } from "app/models/report_data.model";
import { Student } from "app/models/student.model";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: "#ffffff",
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 20,
    borderBottom: "1px solid #dddddd",
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333333",
  },
  subtitle: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 10,
  },
  section: {
    margin: "10px 0",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333333",
    backgroundColor: "#f5f5f5",
    padding: 5,
  },
  summaryRow: {
    flexDirection: "row",
    marginBottom: 10,
  },
  summaryCard: {
    flex: 1,
    padding: 10,
    margin: "0 5px",
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
  },
  summaryLabel: {
    fontSize: 12,
    color: "#666666",
    marginBottom: 5,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
  },
  table: {
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#dddddd",
    marginTop: 10,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableHeader: {
    backgroundColor: "#f5f5f5",
  },
  tableHeaderCell: {
    padding: 5,
    fontWeight: "bold",
    color: "#333333",
    borderBottomWidth: 1,
    borderBottomColor: "#dddddd",
    fontSize: 12,
  },
  tableCell: {
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#eeeeee",
    fontSize: 10,
  },
  col1: { width: "25%" },
  col2: { width: "25%" },
  col3: { width: "25%" },
  col4: { width: "25%" },
  examSection: {
    marginTop: 10,
    marginBottom: 5,
    paddingLeft: 20,
  },
  examTitle: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 3,
  },
  examDetail: {
    fontSize: 9,
    color: "#666666",
    marginBottom: 2,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: "center",
    fontSize: 10,
    color: "#999999",
    borderTopWidth: 1,
    borderTopColor: "#dddddd",
    paddingTop: 10,
  },
  progressBar: {
    height: 10,
    backgroundColor: "#eeeeee",
    borderRadius: 5,
    marginTop: 3,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#155dfc",
    borderRadius: 5,
  },
});

// Componente para la barra de progreso
const ProgressBar = ({ progress }: { progress: number }) => (
  <View style={styles.progressBar}>
    <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
  </View>
);

// Función para calcular el promedio general
const calculateAverageScore = (students: Student[]): number => {
  if (!students.length) return 0;
  const sum = students.reduce((acc, student) => acc + student.averageScore, 0);
  return sum / students.length;
};

// Componente principal del PDF
export const PDFReport = ({ data }: { data: ReportData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Encabezado */}
      <View style={styles.header}>
        <Text style={styles.title}>
          Informe de Progreso: {data.courseTitle}
        </Text>
        <Text style={styles.subtitle}>Generado el: {data.generatedDate}</Text>
      </View>

      {/* Resumen */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Resumen del Informe</Text>
        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Curso</Text>
            <Text style={styles.summaryValue}>{data.courseTitle}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Estudiantes</Text>
            <Text style={styles.summaryValue}>{data.students.length}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Promedio General</Text>
            <Text style={styles.summaryValue}>
              {calculateAverageScore(data.students).toFixed(1)}%
            </Text>
          </View>
        </View>
      </View>

      {/* Tabla de Estudiantes */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Detalle de Estudiantes</Text>
        <View style={styles.table}>
          {/* Encabezado de la tabla */}
          <View style={[styles.tableRow, styles.tableHeader]}>
            <View style={[styles.tableHeaderCell, styles.col1]}>
              <Text>Nombre</Text>
            </View>
            <View style={[styles.tableHeaderCell, styles.col2]}>
              <Text>Progreso</Text>
            </View>
            <View style={[styles.tableHeaderCell, styles.col3]}>
              <Text>Promedio</Text>
            </View>
            <View style={[styles.tableHeaderCell, styles.col4]}>
              <Text>Participación</Text>
            </View>
          </View>

          {/* Filas de la tabla */}
          {data.students.map((student, index) => (
            <View key={index}>
              <View style={styles.tableRow}>
                <View style={[styles.tableCell, styles.col1]}>
                  <Text>{student.username}</Text>
                </View>
                <View style={[styles.tableCell, styles.col2]}>
                  <Text>{(student.courseProgress * 100).toFixed(0)}%</Text>
                  <ProgressBar progress={student.courseProgress} />
                </View>
                <View style={[styles.tableCell, styles.col3]}>
                  <Text>{student.averageScore.toFixed(1)}</Text>
                </View>
                <View style={[styles.tableCell, styles.col4]}>
                  <Text>{student.forumMessages} mensajes</Text>
                </View>
              </View>

              {/* Resultados de exámenes */}
              {student.examResults && student.examResults.length > 0 && (
                <View style={styles.examSection}>
                  <Text style={styles.examTitle}>Exámenes:</Text>
                  {student.examResults.map((exam, examIndex) => (
                    <View key={examIndex}>
                      <Text style={styles.examDetail}>
                        {exam.examTitle}: {exam.score.toFixed(1)} -{" "}
                        {exam.examDate}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>
      </View>

      {/* Pie de página */}
      <View style={styles.footer}>
        <Text>
          Este informe es confidencial y está destinado únicamente para fines
          educativos.
        </Text>
        <Text>
          © {new Date().getFullYear()} Sistema de Gestión de Aprendizaje
        </Text>
      </View>
    </Page>
  </Document>
);

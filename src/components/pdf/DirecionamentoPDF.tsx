import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 35,
    fontFamily: "Helvetica",
    fontSize: 11,
    backgroundColor: "#FFFFFF",
  },

  header: {
    marginBottom: 25,
    borderBottomWidth: 2,
    borderBottomColor: "#D4AF37",
    paddingBottom: 12,
  },

  titulo: {
    fontSize: 28,
    textAlign: "center",
    color: "#5A2D91",
    fontWeight: "bold",
    marginBottom: 4,
  },

  subtitulo: {
    fontSize: 15,
    textAlign: "center",
    color: "#444",
  },

  card: {
    borderWidth: 1,
    borderColor: "#D4AF37",
    borderRadius: 8,
    padding: 12,
    marginBottom: 18,
  },

  label: {
    fontSize: 11,
    color: "#777",
    marginBottom: 2,
  },

  valor: {
    fontSize: 12,
    marginBottom: 5,
  },

  tituloSecao: {
    fontSize: 16,
    color: "#B8860B",
    marginBottom: 8,
    fontWeight: "bold",
  },

  texto: {
    fontSize: 12,
    lineHeight: 1.7,
    textAlign: "justify",
  },

  rodape: {
    marginTop: 35,
    borderTopWidth: 1,
    borderTopColor: "#DDD",
    paddingTop: 10,
    fontSize: 9,
    color: "#777",
    textAlign: "center",
  },
});

type Props = {
  leitura: any;
};

export default function DirecionamentoPDF({ leitura }: Props) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>

  <View style={styles.header}>
    <Text style={styles.titulo}>
      Clube do Tarô
    </Text>

    <Text style={styles.subtitulo}>
      Direcionamento Semanal Personalizado
    </Text>
  </View>

  <View style={styles.card}>
    <Text style={styles.label}>Assinante</Text>
    <Text style={styles.valor}>{leitura.assinante}</Text>

    <Text style={styles.label}>Plano</Text>
    <Text style={styles.valor}>{leitura.plano}</Text>

    <Text style={styles.label}>Período</Text>
    <Text style={styles.valor}>{leitura.periodo}</Text>
 
  </View>

  <View style={styles.card}>
  <Text style={styles.tituloSecao}>Orixá Regente</Text>
  <Text style={styles.texto}>{leitura.orixa}</Text>
</View>

<View style={styles.card}>
  <Text style={styles.tituloSecao}>Carta Cigana</Text>
  <Text style={styles.texto}>{leitura.carta}</Text>
</View>

<View style={styles.card}>
  <Text style={styles.tituloSecao}>Tarô</Text>
  <Text style={styles.texto}>{leitura.taro}</Text>
</View>

<View style={styles.rodape}>
  <Text>Clube do Tarô by Ádria Freitas</Text>
  <Text>Documento exclusivo para assinantes.</Text>
  <Text>www.magiaoriente.com.br</Text>
</View>

</Page>

</Document>

);
}
import Image from "next/image";
import Link from "next/link";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.content}>
          <span className={styles.badge}>
            ✨ Produtos Exclusivos
          </span>

          <h1>
            Loja do
            <br />
            Clube do Tarô
          </h1>

          <p>
            Descubra produtos espirituais cuidadosamente selecionados
            para fortalecer sua caminhada, elevar sua energia e
            transformar sua conexão com a espiritualidade.
          </p>

          <div className={styles.buttons}>
            <Link
              href="./categoria"
              className={styles.primaryButton}
            >
              Comprar Agora
            </Link>

            <Link
              href="../"
              className={styles.secondaryButton}
            >
              Conhecer o Clube
            </Link>
          </div>
        </div>

        <div className={styles.image}>
          <Image
            src="/images/lojaclubedotaro/hero/hero-loja.webp"
            alt="Loja do Clube do Tarô"
            fill
            priority
          />
        </div>
      </div>
    </section>
  );
}
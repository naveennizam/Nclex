'use client';

import { motion } from 'framer-motion';
import Image from "next/image";
import styles from "../styles/HeroSection.module.css"
import dynamic from "next/dynamic";
import { useState, useEffect } from 'react';


export default function HeroSection() {
  const [showModal, setShowModal] = useState(false);

 

  const Modal = dynamic(() => import('../components/layouts/Modal'), {
    ssr: false
  });
  useEffect(() => { }, [showModal]);
  return (
    <>
      <section className={styles.hero}>
        {/* Left Side: Text */}
        <motion.div
          className={styles.heroLeft}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className={styles.heroTitle}>Smarter Learning, For Everyone</h1>
          <p className={styles.heroSubtitle}>
            Your next-generation platform for modern education.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={styles.heroButton}
            onClick={() => setShowModal(true)}
          >
            Get Started
          </motion.button>
        </motion.div>

        {/* Right Side: SVG */}
        <motion.div
          className={styles.heroRight}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          {/* Replace with your actual SVG or <Image /> */}
          <Image src="/images/svg/eLearning.svg" alt='NCLEX' width={500} height={500} data-aos="zoom-out" data-aos-delay="100" />

        </motion.div>
      </section>

      {showModal && <Modal onClose={() => setShowModal(false)} />}
    </>
  );
}

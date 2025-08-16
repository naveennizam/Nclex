import Image from 'next/image';
import Link from 'next/link';
import styles from '../../styles/Header.module.css'; // Assume CSS module for styling

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link href="/">
       
            <Image src="/images/apple-icon-white.png" alt="Logo" width={50} height={40} />
        
        </Link>
      </div>
      <nav className={styles.nav}>
        {/* Add your navigation links or other items here */}
        <Link href="/supportingPages/about">About</Link>
        {/* <Link href="/supportingPages/services">Support</Link> */}
        <Link href="/supportingPages/contact">Contact</Link>
        <Link href="/supportingPages/cool">Cool</Link>

      </nav>
    </header>
  );
}

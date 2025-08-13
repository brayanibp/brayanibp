import Image from 'next/image';
import style from './social.module.css';

export default function Social() {
  const iconsSize = 30;
  return <>
    <aside className={style.social} id="social" aria-label="Social links">
      <ul>
        <li>
          <a target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" href="https://linkedin.com/in/brayanibp">
            <Image src="/assets/icons/linkedin-icon.svg" alt="LinkedIn" width={iconsSize} height={iconsSize}/>
          </a>
        </li>
        <li>
          <a target="_blank" rel="noopener noreferrer" aria-label="GitHub" href="https://github.com/brayanibp">
            <Image src="/assets/icons/github-icon.svg" alt="GitHub" width={iconsSize} height={iconsSize}/>
          </a>
        </li>
        <li>
          <a target='_blank' rel="noopener noreferrer" aria-label="WhatsApp" href="https://wa.me/+584140706625">
            <Image src="/assets/icons/whatsapp-icon.svg" alt="WhatsApp" width={iconsSize} height={iconsSize}/>
          </a>
        </li>
        <li>
          <a target='_blank' rel="noopener noreferrer" aria-label="Instagram" href="https://www.instagram.com/brayanibp/">
            <Image src="/assets/icons/instagram-icon.svg" alt="Instagram" width={iconsSize} height={iconsSize}/>
          </a>
        </li>
      </ul>
    </aside>
  </>;
}
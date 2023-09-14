import Image from 'next/image';

export default function Social() {
  const iconsSize = 30;
  return <>
    <div id="Social">
      <ul>
        <li>
          <a target="_blank" href="https://linkedin.com/in/brayanibp">
            <Image src="assets/icons/linkedin-icon.svg" alt="Linkedin Icon" width={iconsSize} height={iconsSize}/>
          </a>
        </li>
        <li>
          <a target="_blank" href="https://github.com/brayanibp">
            <Image src="assets/icons/github-icon.svg" alt="Github Icon" width={iconsSize} height={iconsSize}/>
          </a>
        </li>
        <li>
          <a target='_blank' href="https://wa.me/+584140706625">
            <Image src="assets/icons/whatsapp-icon.svg" alt="WhatsApp Icon" width={iconsSize} height={iconsSize}/>
          </a>
        </li>
        <li>
          <a target='_blank' href="https://t.me/@brayanIBP">
            <Image src="assets/icons/telegram-black-icon.svg" alt="Telegram Icon" width={iconsSize} height={iconsSize}/>
          </a>
        </li>
      </ul>
    </div>
  </>;
}
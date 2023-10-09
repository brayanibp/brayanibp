import { FormEvent, createRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import Image from "next/image";
import ReCAPTCHA from "react-google-recaptcha";

export default function Contact() {
  const [email, setEmail] = useState({
    email: '',
    message: ''
  });
  const recaptchaRef = createRef<ReCAPTCHA>();
  const handleSubmit = (ev: FormEvent) => {
    ev.preventDefault();
    const email = (document.querySelector('#Contact input[name=email]') as HTMLInputElement).value;
    const message = (document.querySelector('#Contact textarea[name=message]') as HTMLTextAreaElement).value;
    setEmail({
      email: email,
      message: message
    });
    recaptchaRef.current?.execute();
  };
  // const handleTyping = (ev: KeyboardEvent) => {
  //   const element = (ev.currentTarget as Element);
  //   const key = element.attributes.getNamedItem('name')?.value || '';
  //   const value = (element as HTMLInputElement).value;
  //   setEmail((prev)=>{
  //     return {
  //       ...prev,
  //       [key]: value
  //     }
  //   });
  // };
  // const handlePaste = (ev: ClipboardEvent) => {
  //   console.log(ev);
  // }
  const onReCAPTCHAChange = async (captchaCode: string | null) => {
    // If the reCAPTCHA code is null or undefined indicating that
    // the reCAPTCHA was expired then return early
    if (!captchaCode) {
      return;
    }
    const submitButton = document.querySelector('#Contact form button');
    try {
      submitButton?.classList.toggle('sending');
      const response = await fetch("/api/send_email", {
        method: "POST",
        body: JSON.stringify({ email, captcha: captchaCode }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        // If the response is ok than show the success alert
        submitButton?.classList.toggle('sending');
        submitButton?.classList.toggle('success');
      } else {
        // Else throw an error with the message returned
        // from the API
        const error = await response.json();
        throw new Error(error.message)
      }
    } catch (error: any) {
      submitButton?.classList.toggle('error');
    } finally {
      // Reset the reCAPTCHA when the request has failed or succeeeded
      // so that it can be executed again if user submits another email.
      setTimeout(
        ()=>(
          submitButton?.classList.contains('success') 
            ? submitButton?.classList.toggle('success') 
            : submitButton?.classList.toggle('error')
        )
      ,700);
      if (recaptchaRef.current?.state) recaptchaRef.current?.reset();
      setEmail({
        email: '',
        message: ''
      });
    }
  };
  useEffect(()=>{
    const textArea = document.querySelector('#Contact textarea') as Element;
    function resize(ev: Event) {
      if ((ev as KeyboardEvent).key.toLowerCase().includes('backspace')) {
        gsap.to(textArea, {
          height: `auto`,
          duration: 0,
          ease: 'sine.out'
        });
      }
      const height = (ev.currentTarget as Element).scrollHeight;
      if (height > 230) return;
      gsap.to(textArea, {
        height: `calc(${height}px - 2em)`,
        duration: 0,
        ease: 'sine.out'
      });
    }
    textArea?.addEventListener('keydown', resize);
    return () => {
      textArea?.removeEventListener('keydown', resize);
    }
  }, []);
  return <section id="Contact">
    <h2>Contact Me</h2>
    <form className="contact-form" onSubmit={(event: FormEvent)=>handleSubmit(event)}>
      <p>Send me an E-mail!</p>
      <input 
        required 
        name="email" 
        type="email" 
        placeholder="your_email@example.com" 
        // onKeyDown={(ev)=>handleTyping(ev as unknown as KeyboardEvent)} 
        // onPaste={(ev)=>handlePaste(ev as unknown as ClipboardEvent)}
      />
      <textarea 
        required 
        name="message" 
        placeholder="Hi, I wanted to contact you..." 
        // onKeyDown={(ev)=>handleTyping(ev as unknown as KeyboardEvent)} 
      />
      <button type="submit">
        Submit
        <Image src="/assets/icons/arrow.png" alt="Submit Icon" width={32} height={32}/>
      </button>
      <ReCAPTCHA 
        ref={recaptchaRef}
        size="invisible"
        sitekey={process?.env?.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '6LdNEYkoAAAAADFBld6gZ6X1A93XRKJ_Vm8XsxoV'}
        onChange={onReCAPTCHAChange}
      />
    </form>
  </section>;
}
"use client";
import { createRef, useState, type FormEvent } from "react";
import { ArrowRight } from "lucide-react";
import ReCAPTCHA from "react-google-recaptcha";
import style from "./contact.module.css";

type Status = "idle" | "sending" | "success" | "error";

export default function Contact() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const recaptchaRef = createRef<ReCAPTCHA>();
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (status === "sending") {
      return;
    }

    if (!siteKey) {
      setStatus("error");
      setStatusMessage("The contact form is temporarily unavailable.");
      return;
    }

    setStatus("sending");
    setStatusMessage("");
    recaptchaRef.current?.execute();
  };

  const onReCAPTCHAChange = async (captchaCode: string | null) => {
    if (!captchaCode) {
      setStatus("error");
      setStatusMessage("Captcha verification failed. Please try again.");
      recaptchaRef.current?.reset();
      return;
    }

    try {
      const response = await fetch("/api/send_email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, message, captcha: captchaCode, website }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error("Too many requests. Please try again later.");
        }

        if (response.status === 422) {
          throw new Error("Captcha verification failed. Please try again.");
        }

        throw new Error("Unable to send your message. Please try again later.");
      }

      setStatus("success");
      setStatusMessage("Thanks! Your message was sent.");
      setEmail("");
      setMessage("");
    } catch (error) {
      setStatus("error");
      setStatusMessage(
        error instanceof Error ? error.message : "Unable to send your message.",
      );
    } finally {
      recaptchaRef.current?.reset();
    }
  };

  const buttonClassName =
    status === "sending"
      ? style.sending
      : status === "success"
        ? style.success
        : status === "error"
          ? style.error
          : undefined;

  return (
    <section id="contact">
      <h2>Contact Me</h2>
      <form className={style["contact-form"]} onSubmit={handleSubmit}>
        <p>Send me an E-mail!</p>

        <label htmlFor="contact-email">Your email</label>
        <input
          id="contact-email"
          required
          name="email"
          type="email"
          autoComplete="email"
          placeholder="your_email@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={status === "sending"}
        />

        <label htmlFor="contact-message">Message</label>
        <textarea
          id="contact-message"
          required
          name="message"
          placeholder="Hi, I wanted to contact you..."
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          disabled={status === "sending"}
        />

        <div className={style.honeypot} aria-hidden="true">
          <label htmlFor="contact-website">Website</label>
          <input
            id="contact-website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(event) => setWebsite(event.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={status === "sending" || !siteKey}
          className={buttonClassName}
        >
          {status === "sending" ? "Sending..." : "Submit"}
          <ArrowRight className={style.arrowIcon} aria-hidden="true" />
        </button>

        {!siteKey ? (
          <p className={style.status} role="alert">
            The contact form is temporarily unavailable.
          </p>
        ) : null}

        <p className={style.status} role="status" aria-live="polite">
          {statusMessage}
        </p>

        {siteKey ? (
          <ReCAPTCHA
            ref={recaptchaRef}
            size="invisible"
            sitekey={siteKey}
            onChange={onReCAPTCHAChange}
          />
        ) : null}
      </form>
    </section>
  );
}

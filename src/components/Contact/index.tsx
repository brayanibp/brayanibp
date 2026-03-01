"use client";
import { ChangeEvent, FormEvent, createRef, useState } from "react";
import { ArrowRight } from "lucide-react";
// // import ReCAPTCHA from "react-google-recaptcha";
import style from "./contact.module.css";

export default function Contact() {
  const [recaptchaNeeded, setRecaptchaNeeded] = useState(false);
  const [email, setEmail] = useState({
    email: '',
    message: ''
  });

  const recaptchaRef = createRef{/* {/* <div>[ReCAPTCHA Disabled for v3 Build]</div>
      <textarea 
        required 
        name="message" 
        placeholder="Hi, I wanted to contact you..."
        onChange={(ev)=>handleChange(ev)}
      />
      <button type="submit">
        Submit
        <ArrowRight className={style.arrowIcon} aria-hidden="true" />
      </button>
      {
        recaptchaNeeded && (
          {/* {/* <div>[ReCAPTCHA Disabled for v3 Build]</div>
        ) 
      }
    </form>
  </section>;
}
"use client";

import { useEffect, useId, useRef, useState } from "react";
import { cx } from "@/lib/utils";
import { LEAD_FIELDS, checkLeadField } from "@/lib/lead";
import Icon from "@/components/ui/Icon";

function FieldError({ id, message }) {
  return (
    <p className="as-field-err" id={id} hidden={!message}>
      <Icon name="alert" size={14} />
      <span>{message}</span>
    </p>
  );
}

/**
 * The lead form's inputs and states (client island).
 * Validation runs on submit; each problem gets an inline message and focus moves to the first one.
 * A field re-checks on change once it has been flagged. Success swaps the form for a confirmation.
 * Without JavaScript the form still posts to /api/lead.
 */
export default function LeadFormFields({ submitLabel, successTitle, successText }) {
  const uid = useId();
  const formRef = useRef(null);
  const doneRef = useRef(null);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | done | failed

  // Move focus to the confirmation once it's visible, so screen readers announce it.
  useEffect(() => {
    if (status === "done") doneRef.current?.focus();
  }, [status]);

  const fieldId = (name) => `${uid}-${name}`;
  const errId = (name) => `${uid}-${name}-err`;

  const readValue = (form, name) =>
    name === "hasWebsite" ? form.querySelector('[name="hasWebsite"]:checked')?.value || "" : form.elements[name]?.value || "";

  const onChange = (e) => {
    const name = e.target.name;
    if (!errors[name]) return;
    setErrors((prev) => ({ ...prev, [name]: checkLeadField(name, readValue(formRef.current, name)) }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const form = formRef.current;
    const next = {};
    for (const name of LEAD_FIELDS) {
      const message = checkLeadField(name, readValue(form, name));
      if (message) next[name] = message;
    }
    setErrors(next);
    const firstBad = LEAD_FIELDS.find((name) => next[name]);
    if (firstBad) {
      form.querySelector(`[name="${firstBad}"]`)?.focus();
      return;
    }

    setStatus("sending");
    try {
      const body = Object.fromEntries(LEAD_FIELDS.map((name) => [name, readValue(form, name)]));
      body.company = form.elements.company?.value || ""; // honeypot
      body.page = window.location.pathname;
      const res = await fetch(form.action, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json().catch(() => ({}));
      if (res.status === 422 && json.errors) {
        setErrors(json.errors);
        setStatus("idle");
        return;
      }
      if (!res.ok) throw new Error(json.error || `Request failed (${res.status})`);
      setStatus("done");
    } catch {
      setStatus("failed");
    }
  };

  const text = (name, label, autoComplete, type = "text") => (
    <div className={cx("as-field", errors[name] && "is-invalid")}>
      <label htmlFor={fieldId(name)}>{label}</label>
      <input
        id={fieldId(name)}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required
        maxLength={200}
        aria-invalid={errors[name] ? "true" : undefined}
        aria-describedby={errors[name] ? errId(name) : undefined}
      />
      <FieldError id={errId(name)} message={errors[name]} />
    </div>
  );

  return (
    <>
      <form
        ref={formRef}
        className="as-leadform"
        action="/api/lead"
        method="post"
        noValidate
        hidden={status === "done"}
        onSubmit={onSubmit}
        onChange={onChange}
      >
        {text("name", "Name", "name")}
        {text("business", "Business name", "organization")}
        {text("contact", "Email or phone", "email")}

        <fieldset
          className={cx("as-field", "as-choice", errors.hasWebsite && "is-invalid")}
          aria-describedby={errors.hasWebsite ? errId("hasWebsite") : undefined}
        >
          <legend>Do you have a website?</legend>
          <div className="as-seg">
            <label>
              <input type="radio" name="hasWebsite" value="yes" required />
              <span>Yes</span>
            </label>
            <label>
              <input type="radio" name="hasWebsite" value="no" />
              <span>No</span>
            </label>
          </div>
          <FieldError id={errId("hasWebsite")} message={errors.hasWebsite} />
        </fieldset>

        {/* Honeypot: hidden from people and assistive tech; bots that fill it are ignored. */}
        <div className="as-sr" aria-hidden="true">
          <label htmlFor={fieldId("company")}>Company website</label>
          <input id={fieldId("company")} name="company" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        {status === "failed" && (
          <p className="as-field-err" role="alert">
            <Icon name="alert" size={14} />
            <span>Something went wrong sending your request. Please try again, or call or email us.</span>
          </p>
        )}

        <button
          type="submit"
          className="as-btn as-btn-primary as-btn-lg as-btn-block"
          aria-disabled={status === "sending" ? "true" : undefined}
          disabled={status === "sending"}
        >
          {status === "sending" ? "Sending…" : submitLabel}
          <Icon name="arrow" size={18} className="as-arrow" />
        </button>
      </form>

      <div ref={doneRef} className="as-leadform-done" role="status" tabIndex={-1} hidden={status !== "done"}>
        <span className="as-done-ic">
          <Icon name="check" size={26} />
        </span>
        <h3 className="as-h3">{successTitle}</h3>
        <p>{successText}</p>
      </div>
    </>
  );
}

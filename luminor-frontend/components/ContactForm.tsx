"use client";

import { useState } from "react";
import Button from "./Button";
import styles from "./ContactForm.module.css";

export default function ContactForm() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        service: "other",
    });

    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("submitting");

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/contact/send`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to send message");
            }

            setStatus("success");
            setFormData({
                name: "",
                email: "",
                phone: "",
                subject: "",
                message: "",
                service: "other",
            });
        } catch (error: any) {
            console.error("Form error:", error);
            setStatus("error");
            setErrorMessage(error.message || "Something went wrong. Please try again.");
        }
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.grid}>
                <div className={styles.formGroup}>
                    <label htmlFor="name" className={styles.label}>Ime i Prezime *</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        className={styles.input}
                        placeholder="Vaše ime"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="email" className={styles.label}>Email Adresa *</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        className={styles.input}
                        placeholder="vas@email.com"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div className={styles.grid}>
                <div className={styles.formGroup}>
                    <label htmlFor="phone" className={styles.label}>Telefon</label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        className={styles.input}
                        placeholder="+381..."
                        value={formData.phone}
                        onChange={handleChange}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="service" className={styles.label}>Zainteresovan/a sam za</label>
                    <div className={styles.selectWrapper}>
                        <select
                            id="service"
                            name="service"
                            className={styles.select}
                            value={formData.service}
                            onChange={handleChange}
                        >
                            <option value="web-development">Web Development</option>
                            <option value="graphic-design">Graphic Design</option>
                            <option value="digital-marketing">Digital Marketing</option>
                            <option value="seo">SEO</option>
                            <option value="ai-automation">AI & Automation</option>
                            <option value="hosting">Hosting</option>
                            <option value="other">Ostalo</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="subject" className={styles.label}>Predmet *</label>
                <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    className={styles.input}
                    placeholder="Kako vam možemo pomoći?"
                    value={formData.subject}
                    onChange={handleChange}
                />
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="message" className={styles.label}>Poruka *</label>
                <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    className={styles.textarea}
                    placeholder="Opišite vaš projekat ili pitanje..."
                    value={formData.message}
                    onChange={handleChange}
                />
            </div>

            <div className={styles.submitWrapper}>
                <Button
                    type="submit"
                    disabled={status === "submitting"}
                    fullWidth
                    size="lg"
                >
                    {status === "submitting" ? "Slanje..." : "Pošalji Poruku"}
                </Button>
            </div>

            {status === "success" && (
                <div className={styles.successMessage}>
                    Hvala na poruci! Javićemo vam se uskoro.
                </div>
            )}

            {status === "error" && (
                <div className={styles.errorMessage}>
                    {errorMessage}
                </div>
            )}
        </form>
    );
}

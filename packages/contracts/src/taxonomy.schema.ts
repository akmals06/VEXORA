import { z } from "zod";

/**
 * 10 Approved Non-Clinical Workplace Issue Domains (Restored per Phase 2.5 D-02).
 * Strictly workplace-problem-first; zero diagnostic or burnout terminology.
 */
export const daftar_id_masalah = [
  "workload_pressure",
  "workplace_relationships",
  "bullying_harassment",
  "discrimination_fairness",
  "role_clarity",
  "employment_rights",
  "career_growth",
  "digital_adaptation",
  "emotional_support",
  "unsure",
] as const;

export const skema_id_masalah = z.enum(daftar_id_masalah);

export const daftar_id_masalah_spesifik = [
  "workload_pressure",
  "workplace_relationships",
  "bullying_harassment",
  "discrimination_fairness",
  "role_clarity",
  "employment_rights",
  "career_growth",
  "digital_adaptation",
  "emotional_support",
] as const;

export const skema_id_masalah_spesifik = z.enum(daftar_id_masalah_spesifik);

/**
 * 5 Approved Product Pillars (Restored per Phase 0 & Phase 2.5 D-02).
 */
export const daftar_id_pilar = [
  "work_wellbeing",
  "safe_workplace",
  "know_your_rights",
  "professional_support",
  "career_growth",
] as const;

export const skema_id_pilar = z.enum(daftar_id_pilar);

/**
 * 8 Approved Deterministic Outcome Classes (Non-Clinical, Non-Adjudicative).
 */
export const daftar_kelas_hasil = [
  "understand",
  "prepare",
  "workplace_support",
  "employee_protection",
  "psychological_support",
  "legal_support",
  "career_support",
  "immediate_safety_redirect",
] as const;

export const skema_kelas_hasil = z.enum(daftar_kelas_hasil);

/**
 * 9 Approved Support Types.
 */
export const daftar_id_tipe_dukungan = [
  "self_guided_resource",
  "manager_discussion",
  "hr_workplace_support",
  "employee_protection",
  "psychological_support",
  "legal_information",
  "legal_support",
  "career_support",
  "immediate_safety_redirect",
] as const;

export const skema_id_tipe_dukungan = z.enum(daftar_id_tipe_dukungan);

/**
 * 6 Approved Conversation & Situation Preparation Recipients (Restored per Phase 2.5 D-03 & P-08).
 */
export const daftar_tipe_penerima = [
  "manager",
  "hr",
  "psychologist",
  "counselor",
  "legal_professional",
  "career_professional",
] as const;

export const skema_tipe_penerima = z.enum(daftar_tipe_penerima);

/**
 * Approved Non-Clinical Psychological Support Categories (Phase 2.5 P-06).
 */
export const daftar_kategori_dukungan_psikologis = [
  "psychoeducation",
  "coping_strategies",
  "emotional_regulation",
  "work_related_coping",
  "professional_consultation_prep",
] as const;

export const skema_kategori_dukungan_psikologis = z.enum(daftar_kategori_dukungan_psikologis);

/**
 * 5-Layer Conceptual & Ethical Separation (Phase 2.5 Critical Separation).
 */
export const daftar_lapisan_batas_psikologis = [
  "workplace_issue_navigation",
  "psychological_screening_early_indication",
  "non_clinical_psychological_support",
  "qualified_professional_assessment",
  "clinical_diagnosis_never_by_voxera",
] as const;

export const skema_lapisan_batas_psikologis = z.enum(daftar_lapisan_batas_psikologis);

/**
 * Approved Professional Referral Trigger Reasons (Phase 2.5 P-07).
 */
export const daftar_alasan_rujukan_profesional = [
  "explicit_employee_request",
  "approved_screening_referral_condition",
  "self_reported_daily_functioning_interference",
  "approved_ethical_referral_rule",
] as const;

export const skema_alasan_rujukan_profesional = z.enum(daftar_alasan_rujukan_profesional);

/**
 * Non-Sensitive Continuity Statuses (Phase 2.5 Option B).
 */
export const daftar_status_perjalanan = ["aktif", "ditindaklanjuti", "diarsipkan"] as const;

export const skema_status_perjalanan = z.enum(daftar_status_perjalanan);

export const daftar_status_langkah = [
  "belum_dimulai",
  "sedang_berjalan",
  "selesai",
  "dilewati",
] as const;

export const skema_status_langkah = z.enum(daftar_status_langkah);

/**
 * Ethical & Safety Guardrail Notice Codes.
 */
export const daftar_kode_peringatan_penjaga = [
  "non_diagnostic_boundary",
  "non_legal_verdict_boundary",
  "chain_of_command_bypass",
  "hygiene_rights_protection_priority",
  "confidential_psychological_boundary",
] as const;

export const skema_kode_peringatan_penjaga = z.enum(daftar_kode_peringatan_penjaga);

export type IssueId = z.infer<typeof skema_id_masalah>;
export type SpecificIssueId = z.infer<typeof skema_id_masalah_spesifik>;
export type PillarId = z.infer<typeof skema_id_pilar>;
export type OutcomeClass = z.infer<typeof skema_kelas_hasil>;
export type SupportTypeId = z.infer<typeof skema_id_tipe_dukungan>;
export type RecipientType = z.infer<typeof skema_tipe_penerima>;
export type PsychologicalSupportCategory = z.infer<typeof skema_kategori_dukungan_psikologis>;
export type PsychologicalBoundaryLayer = z.infer<typeof skema_lapisan_batas_psikologis>;
export type ProfessionalReferralReason = z.infer<typeof skema_alasan_rujukan_profesional>;
export type JourneyStatus = z.infer<typeof skema_status_perjalanan>;
export type FollowUpStepStatus = z.infer<typeof skema_status_langkah>;
export type GuardrailWarningCode = z.infer<typeof skema_kode_peringatan_penjaga>;

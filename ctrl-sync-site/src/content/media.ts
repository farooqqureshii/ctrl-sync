/**
 * Static assets live in /public — built URLs are rooted at /.
 * Deliverables: public/docs/
 */
export const MEDIA = {
  documents: [
    { label: "Presentation slides", file: "/docs/presentation-1.pptx" },
    { label: "Team contract", file: "/docs/team-contract.pdf" },
    { label: "Client meeting notes", file: "/docs/client-meeting.pdf" },
    { label: "Deliverable — parts B–D", file: "/docs/pd-b-d-final.pdf" },
    { label: "Deliverable — part F", file: "/docs/pd-f-resubmission.pdf" },
    { label: "Deliverable — milestone B & C", file: "/docs/deliverable-bc-resubmission.pdf" },
  ] as const,
}

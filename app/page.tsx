"use client";

import { useEffect, useMemo, useState } from "react";
import { BookOpen, RefreshCw, School, GraduationCap, ChevronRight, ChevronLeft } from "lucide-react";

type FormState = {
  subject: string;
  topic: string;
  university?: string;
  year?: string;
};

const subjectOptions = [
  "Accounting", "Actuarial Science", "Aeronautical Engineering", "Artificial Intelligence",
  "Biochemistry", "Biology", "Biomedical Science", "Business Management", "Chemistry",
  "Civil Engineering", "Classics", "Computer Science", "Criminology", "Data Science",
  "Dentistry", "Economics", "Education", "Electrical Engineering", "English Literature",
  "Environmental Science", "Finance", "Geography", "Geology", "History", "International Relations",
  "Law", "Linguistics", "Management", "Marketing", "Materials Science", "Mathematics", "Mechanical Engineering",
  "Medicine", "Modern Languages", "Music", "Nursing", "Pharmacology", "Philosophy", "Physics",
  "Politics", "Psychology", "Sociology", "Sports Science", "Statistics", "Veterinary Medicine"
];

const genericTopicOptions = [
  "Monetary Policy", "Fiscal Policy", "Elasticity", "Market Failure", "Game Theory", "Regression Analysis",
  "Hypothesis Testing", "Protein Structure", "Enzyme Kinetics", "Cell Cycle", "DNA Replication",
  "Thermodynamics", "Quantum Mechanics", "Electromagnetism", "Control Systems", "Algorithm Design",
  "Database Normalisation", "Operating Systems", "Computer Networks", "Machine Learning",
  "Neural Networks", "Supply Chain", "Corporate Finance", "Portfolio Theory", "Derivatives",
  "Statistical Inference", "Time Series", "Clinical Trials", "Pharmacokinetics", "Epidemiology",
  "Constitutional Law", "Contract Law", "Torts", "EU Law", "International Law",
  "Cognitive Psychology", "Social Psychology", "Developmental Psychology", "Research Methods",
  "Structural Analysis", "Fluid Mechanics", "Heat Transfer"
];

const universities = [
  "AECC University College",
  "Anglia Ruskin University",
  "Arden University",
  "Arts University Bournemouth",
  "Aston University",
  "Bangor University", // Wales (excluded if filtering strictly England)
  "Bath Spa University",
  "Birkbeck, University of London",
  "Bishop Grosseteste University",
  "Birmingham City University",
  "BNU (Buckinghamshire New University)",
  "Bournemouth University",
  "Brunel University London",
  "Canterbury Christ Church University",
  "City, University of London",
  "Coventry University",
  "Cranfield University",
  "De Montfort University",
  "Durham University",
  "Edge Hill University",
  "Falmouth University",
  "Goldsmiths, University of London",
  "Harper Adams University",
  "Hartpury University",
  "Keele University",
  "Kingston University",
  "Lancaster University",
  "Leeds Arts University",
  "Leeds Beckett University",
  "Leeds Conservatoire",
  "Leeds Trinity University",
  "Liverpool Hope University",
  "Liverpool John Moores University",
  "London Metropolitan University",
  "London School of Economics and Political Science (LSE)",
  "London School of Hygiene & Tropical Medicine",
  "London South Bank University",
  "Loughborough University",
  "Manchester Metropolitan University",
  "Middlesex University",
  "Newcastle University",
  "Newman University, Birmingham",
  "Norwich University of the Arts",
  "Northumbria University",
  "Nottingham Trent University",
  "Open University",
  "Oxford Brookes University",
  "Plymouth Marjon University",
  "Queen Mary University of London",
  "Ravensbourne University London",
  "Regent's University London",
  "Royal Academy of Music",
  "Royal Agricultural University",
  "Royal Central School of Speech and Drama",
  "Royal College of Art",
  "Royal College of Music",
  "Royal Holloway, University of London",
  "Royal Northern College of Music",
  "Saint Mary's University, Twickenham",
  "Sheffield Hallam University",
  "SOAS University of London",
  "Solent University",
  "Staffordshire University",
  "St George's, University of London",
  "Teesside University",
  "The University of Law",
  "University College Birmingham",
  "University for the Creative Arts",
  "University of Bath",
  "University of Bedfordshire",
  "University of Birmingham",
  "University of Bolton",
  "University of Bradford",
  "University of Brighton",
  "University of Bristol",
  "University of Buckingham",
  "University of Cambridge",
  "University of Central Lancashire (UCLan)",
  "University of Chester",
  "University of Chichester",
  "University of Cumbria",
  "University of Derby",
  "University of Durham",
  "University of East Anglia (UEA)",
  "University of East London",
  "University of Essex",
  "University of Exeter",
  "University of Gloucestershire",
  "University of Greenwich",
  "University of Hertfordshire",
  "University of Huddersfield",
  "University of Hull",
  "University of Kent",
  "University of Leeds",
  "University of Leicester",
  "University of Lincoln",
  "University of Liverpool",
  "University of London (federal)",
  "University of Manchester",
  "University of Newcastle upon Tyne",
  "University of Northampton",
  "University of Northumbria at Newcastle",
  "University of Nottingham",
  "University of Oxford",
  "University of Plymouth",
  "University of Portsmouth",
  "University of Reading",
  "University of Salford",
  "University of Sheffield",
  "University of Southampton",
  "University of St Mark & St John (Marjon)",
  "University of Sunderland",
  "University of Surrey",
  "University of Sussex",
  "University of the Arts London",
  "University of Warwick",
  "University of West London",
  "University of Westminster",
  "University of Winchester",
  "University of Wolverhampton",
  "University of Worcester",
  "University of York",
  "UCL (University College London)",
  "UWE Bristol (University of the West of England)",
  "Writtle University College",
  "York St John University",
  "Imperial College London",
  "King's College London",
];

const years = ["Year 1", "Year 2", "Year 3", "Year 4+", "Postgraduate"];

export default function Home() {
  const [step, setStep] = useState<number>(1);
  const [form, setForm] = useState<FormState>({ subject: "", topic: "" });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [notesPage, setNotesPage] = useState<1 | 2>(1);
  const [viewportH, setViewportH] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [enriched, setEnriched] = useState<{
    summary?: string;
    extract?: string;
    terms?: { term: string; definition: string }[];
    academicParagraphs?: string[];
    citations?: { title: string; doi?: string; url?: string; year?: string }[];
  }>({});
  const [enrichError, setEnrichError] = useState<string | undefined>(undefined);

  const isStep1Valid = form.subject.trim().length > 0 && form.topic.trim().length > 0;

  function resetAll() {
    setForm({ subject: "", topic: "", university: undefined, year: undefined });
    setTouched({});
    setStep(1);
    setNotesPage(1);
  }

  function handleChange<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const notes = useMemo(() => generateNotes(form), [form]);

  // Try to fetch topic info from Wikipedia to enrich the notes
  useEffect(() => {
    async function enrichFromWikipedia() {
      if (step !== 3) return;
      const topic = form.topic.trim();
      if (!topic) return;
      setLoading(true);
      setEnrichError(undefined);
      try {
        const tryTitles = [
          topic,
          `${form.subject.trim()} ${topic}`,
          form.university ? `${form.university} ${topic}` : "",
          form.year ? `${topic} ${form.year}` : "",
        ].filter(Boolean);
        let got: { title?: string; summary?: string; extract?: string } | null = null;
        for (const t of tryTitles) {
          const summaryRes = await fetch(
            `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(t)}`,
          );
          if (summaryRes.ok) {
            const s = await summaryRes.json();
            if (s && s.extract) {
              got = { title: s.title, summary: s.extract };
              // Try longer plain extract via action API
              const extractRes = await fetch(
                `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&explaintext=1&redirects=1&titles=${encodeURIComponent(
                  s.title || t,
                )}&format=json&origin=*`,
              );
              if (extractRes.ok) {
                const ej = await extractRes.json();
                const pages = ej?.query?.pages ?? {};
                const firstKey = Object.keys(pages)[0];
                const extractText = firstKey ? pages[firstKey]?.extract : undefined;
                if (extractText && typeof extractText === "string") {
                  got.extract = extractText;
                }
              }
              break;
            }
          }
        }
        if (!got) {
          throw new Error("No Wikipedia summary found");
        }

        // Heuristic term extraction: take sentences with pattern "X is" from the first ~20 sentences
        const text = (got.extract || got.summary || "").replace(/\n+/g, " \n ");
        const sentences = text
          .split(/(?<=[.!?])\s+/)
          .map((s: string) => s.trim())
          .filter(Boolean)
          .slice(0, 40);

        const termDefs: { term: string; definition: string }[] = [];
        const pushUnique = (term: string, definition: string) => {
          if (!term || !definition) return;
          const exists = termDefs.some((x) => x.term.toLowerCase() === term.toLowerCase());
          if (!exists) termDefs.push({ term, definition });
        };

        // First, the main topic definition
        if (got.summary) {
          pushUnique(topic, got.summary.split(/\n|\./)[0] + ".");
        }

        // Then scan sentences for "Term is" patterns
        for (const s of sentences) {
          const m = s.match(/([A-Z][A-Za-z0-9 \-()]+?)\s+is\s+(an?|the)\s+(.+?)[\.;]/);
          if (m) {
            const term = m[1].trim();
            const definition = s.replace(/\s+/g, " ").trim();
            if (term.length <= 60 && definition.length >= 30) {
              pushUnique(term, definition);
            }
          }
          if (termDefs.length >= 6) break;
        }

        // Fetch academic metadata via CrossRef (university-level sources proxy)
        const crossrefQueryParts = [form.subject, topic, form.year || ""].filter(Boolean).join(" ");
        const filters = ["type:journal-article"]; // prefer peer-reviewed journal articles
        const affiliationParam = form.university ? `&query.affiliation=${encodeURIComponent(form.university)}` : "";
        const crossrefUrl = `https://api.crossref.org/works?rows=8&select=title,URL,DOI,issued,abstract&filter=${filters.join(
          ",",
        )}&query=${encodeURIComponent(crossrefQueryParts)}${affiliationParam}`;
        let academicParagraphs: string[] = [];
        let citations: { title: string; doi?: string; url?: string; year?: string }[] = [];
        try {
          const cr = await fetch(crossrefUrl, { headers: { Accept: "application/json" } });
          if (cr.ok) {
            const cj = await cr.json();
            const items: any[] = cj?.message?.items || [];
            for (const it of items) {
              const title = Array.isArray(it.title) ? it.title[0] : it.title;
              const doi = it.DOI;
              const url = it.URL;
              const year = it.issued?.["date-parts"]?.[0]?.[0]?.toString();
              citations.push({ title, doi, url, year });
              if (typeof it.abstract === "string") {
                const text = it.abstract
                  .replace(/<jats:[^>]+>/g, " ")
                  .replace(/<[^>]+>/g, " ")
                  .replace(/\s+/g, " ")
                  .trim();
                if (text && text.length > 120) academicParagraphs.push(text);
              }
              if (academicParagraphs.length >= 6) break;
            }
          }
        } catch (_) {
          // ignore CrossRef errors to keep UI resilient
        }

        setEnriched({
          summary: got.summary,
          extract: got.extract,
          terms: termDefs.slice(0, 5),
          academicParagraphs,
          citations,
        });
      } catch (e: any) {
        setEnrichError(e?.message || "Failed to fetch background info");
        setEnriched({});
      } finally {
        setLoading(false);
      }
    }
    enrichFromWikipedia();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, form.topic, form.subject]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const setH = () => setViewportH(window.innerHeight || 0);
      setH();
      window.addEventListener("resize", setH);
      return () => window.removeEventListener("resize", setH);
    }
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:py-16 text-white">
      {step === 3 && notesPage === 1 && loading && (
        <div className="min-h-[60vh] flex items-center justify-center text-center">
          <p className="text-sm text-white/90"> wait patiently while the notes load</p>
        </div>
      )}
      {!(step === 3 && notesPage === 1 && loading) && (
        <>
      <header className="mb-8 sm:mb-10 flex items-center gap-3">
        <div className="inline-flex size-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur">
          <BookOpen className="size-6" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold">Zakify</h1>
          <p className="text-sm text-white/70">UK Uni Revision Helper</p>
        </div>
      </header>

      <div className="space-y-6">
        {step === 1 && (
          <Card>
            <CardHeader icon={<School className="size-5" />} title="Step 1: Subject & Topic" />
            <div className="grid gap-4 sm:grid-cols-2">
              <ComboBox
                label="Subject"
                required
                placeholder="Start typing or pick from the list"
                value={form.subject}
                options={subjectOptions}
                onChange={(v) => handleChange("subject", v)}
                onBlur={() => setTouched((t) => ({ ...t, subject: true }))}
                error={touched.subject && !form.subject.trim() ? "Required" : undefined}
              />
              <ComboBox
                label="Topic"
                required
                placeholder="Start typing or pick from the list"
                value={form.topic}
                options={getTopicOptions(form.subject)}
                onChange={(v) => handleChange("topic", v)}
                onBlur={() => setTouched((t) => ({ ...t, topic: true }))}
                error={touched.topic && !form.topic.trim() ? "Required" : undefined}
              />
            </div>
            <CardFooter>
              <Button disabled={!isStep1Valid} onClick={() => setStep(2)}>
                Continue
              </Button>
            </CardFooter>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader icon={<GraduationCap className="size-5" />} title="Step 2: Optional Details" />
            <div className="grid gap-4 sm:grid-cols-2">
              <Select
                label="University (optional)"
                placeholder="Select a university"
                value={form.university ?? ""}
                onChange={(v) => handleChange("university", v || undefined)}
                options={[""].concat(universities)}
              />
              <Select
                label="Year (optional)"
                placeholder="Select a year"
                value={form.year ?? ""}
                onChange={(v) => handleChange("year", v || undefined)}
                options={[""].concat(years)}
              />
            </div>
            <CardFooter>
              <div className="flex gap-3">
                <Button variant="ghost" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button onClick={() => setStep(3)}>Generate Notes</Button>
        </div>
            </CardFooter>
          </Card>
        )}

        {step === 3 && (
          <Card>
            <CardHeader icon={<BookOpen className="size-5" />} title="Revision Notes" />
            {notesPage === 1 && (
              <div className="space-y-6">
                {enrichError && (
                  <p className="text-sm text-red-300">{enrichError}</p>
                )}
                <NotesStructured
                  title="Detailed Notes"
                  sections={buildStructuredNotes(form, enriched)}
                />
              </div>
            )}
            {notesPage === 2 && (
              <div className="space-y-8">
                <MisunderstandingsList items={buildMisunderstandings(form, enriched)} />
                <ModelEssay block={buildModelEssay(form, enriched, viewportH)} />
              </div>
            )}
            <CardFooter>
              <div className="flex gap-3">
                <Button onClick={resetAll}>
                  <RefreshCw className="size-4 mr-2" /> New Topic
                </Button>
                <Button variant="ghost" onClick={() => setStep(2)}>
                  Back
                </Button>
                {notesPage === 1 && (
                  <Button onClick={() => setNotesPage(2)}>
                    Next <ChevronRight className="size-4 ml-2" />
                  </Button>
                )}
                {notesPage === 2 && (
                  <Button onClick={() => setNotesPage(1)}>
                    <ChevronLeft className="size-4 mr-2" /> Prev
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        )}
      </div>
        </>
      )}
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/10 p-5 sm:p-6 text-white shadow-xl backdrop-blur">
      {children}
    </section>
  );
}

function CardHeader({ title, icon }: { title: string; icon?: React.ReactNode }) {
  return (
    <div className="mb-5 flex items-center gap-2">
      {icon}
      <h2 className="text-lg sm:text-xl font-semibold">{title}</h2>
        </div>
  );
}

function CardFooter({ children }: { children: React.ReactNode }) {
  return <div className="mt-6 flex justify-end">{children}</div>;
}

function Button({
  children,
  onClick,
  disabled,
  variant = "primary",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "ghost";
}) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed";
  const styles =
    variant === "primary"
      ? "bg-indigo-500 hover:bg-indigo-400 text-white"
      : "bg-transparent hover:bg-white/10 text-white border border-white/10";
  return (
    <button onClick={onClick} disabled={disabled} className={`${base} ${styles}`}>
      {children}
    </button>
  );
}

function Field({
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  required,
}: {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  error?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm text-white/80">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-indigo-400/60"
      />
      {error && <p className="mt-1 text-xs text-red-300">{error}</p>}
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  placeholder,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  options: string[];
}) {
  return (
    <div>
      <label className="mb-1 block text-sm text-white/80">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-indigo-400/60"
      >
        {placeholder && (
          <option value="" className="bg-purple-900">
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt} value={opt} className="bg-purple-900">
            {opt || placeholder}
          </option>
        ))}
      </select>
        </div>
  );
}

function ComboBox({
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  options,
  required,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  options: string[];
  required?: boolean;
  error?: string;
}) {
  const [open, setOpen] = useState(false);
  const filtered = useMemo(() => {
    const q = value.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.toLowerCase().includes(q));
  }, [value, options]);

  return (
    <div className="relative">
      <label className="mb-1 block text-sm text-white/80">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input
        value={value}
        onFocus={() => setOpen(true)}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-indigo-400/60"
      />
      {error && <p className="mt-1 text-xs text-red-300">{error}</p>}
      {open && (
        <div
          className="absolute z-20 mt-2 max-h-56 w-full overflow-y-auto rounded-xl border border-white/15 bg-white/10 backdrop-blur shadow-xl"
          onMouseDown={(e) => e.preventDefault()}
        >
          {filtered.map((opt) => (
            <button
              key={opt}
              type="button"
              className="w-full text-left px-3 py-2 hover:bg-white/15"
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
            >
              {opt}
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="px-3 py-2 text-sm text-white/70">No matches</div>
          )}
        </div>
      )}
    </div>
  );
}

type Notes = ReturnType<typeof generateNotes>;

function NotesSection({ title, content }: { title: string; content: string }) {
  return (
    <div>
      <h3 className="mb-3 text-lg sm:text-xl font-semibold underline">{title}</h3>
      <p className="whitespace-pre-wrap text-sm leading-6 text-white/90">{content}</p>
    </div>
  );
}

function NotesStructured({
  title,
  sections,
}: {
  title: string;
  sections: { heading: string; content: string }[];
}) {
  return (
    <div>
      <h3 className="mb-3 text-lg sm:text-xl font-semibold underline">{title}</h3>
      <div className="space-y-4">
        {sections.map((s, i) => (
          <div key={`sec-${i}`}>
            <h4 className="mb-1 text-base sm:text-lg font-semibold underline">{s.heading}</h4>
            <p className="whitespace-pre-wrap text-sm leading-6 text-white/90">{s.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function TermsList({ terms }: { terms: { term: string; definition: string }[] }) {
  return (
    <div>
      <h3 className="mb-3 text-lg sm:text-xl font-semibold underline">Key Terms</h3>
      <dl className="space-y-3">
        {terms.map((t, i) => (
          <div key={`term-${i}`} className="rounded-xl bg-white/5 p-3 border border-white/10">
            <dt className="font-semibold">{t.term}</dt>
            <dd className="text-sm text-white/90">{t.definition}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function QAList({ items }: { items: { question: string; answer: string }[] }) {
  return (
    <div />
  );
}

function MisunderstandingsList({ items }: { items: string[] }) {
  return (
    <div>
      <h3 className="mb-3 text-lg sm:text-xl font-semibold underline">Common Misunderstandings</h3>
      <ul className="list-disc space-y-1 pl-5 text-sm text-white/90">
        {items.map((x, i) => (
          <li key={`mis-${i}`}>{x}</li>
        ))}
      </ul>
    </div>
  );
}

function ModelEssay({
  block,
}: {
  block: { question: string; essay: string; references?: { title: string; year?: string; doi?: string; url?: string }[] };
}) {
  return (
    <div>
      <h3 className="mb-3 text-lg sm:text-xl font-semibold underline">Exam Question & Model Essay</h3>
      <p className="font-medium">{block.question}</p>
      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-white/90">{block.essay}</p>
      {!!block.references?.length && (
        <div className="mt-3 text-xs text-white/70">
          <div className="font-semibold">References</div>
          <ul className="list-disc pl-5">
            {block.references.map((r, i) => (
              <li key={`ref-${i}`}>
                {r.title}
                {r.year ? `, ${r.year}` : ""}
                {r.doi ? `, DOI: ${r.doi}` : ""}
                {r.url ? `, ${r.url}` : ""}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function simplifyText(input: string) {
  // Very light simplification: remove parentheticals and long clauses, keep concise sentences
  const noParens = input.replace(/\([^\)]*\)/g, "");
  const sentences = noParens
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => (s.length > 220 ? s.slice(0, 200) + "..." : s));
  // Merge short sentences into concise paragraphs of 2-3 sentences
  const paras: string[] = [];
  for (let i = 0; i < sentences.length; i += 2) {
    const chunk = sentences.slice(i, i + 2).join(" ");
    if (chunk) paras.push(chunk);
  }
  return paras;
}

function buildNotesOnly(summary?: string, extract?: string, academic?: string[]) {
  const paras: string[] = [];
  if (summary) {
    const simp = simplifyText(summary).slice(0, 2);
    if (simp.length) paras.push("In simple terms: " + simp[0]);
    if (simp[1]) paras.push(simp[1]);
  }
  if (extract) {
    const blocks = extract.split("\n").map((b) => b.trim()).filter(Boolean);
    for (const b of blocks) {
      if (b.length >= 80) {
        const simp = simplifyText(b)[0];
        if (simp) paras.push(simp);
      }
      if (paras.length >= 7) break; // keep to roughly a page
    }
  }
  if (academic && academic.length) {
    for (const a of academic) {
      const simp = simplifyText(a)[0];
      if (simp) paras.push(simp);
      if (paras.length >= 10) break;
    }
  }
  return paras.join("\n\n");
}

function buildStructuredNotes(
  form: FormState,
  enriched: { summary?: string; extract?: string; academicParagraphs?: string[] },
) {
  const blocks: { heading: string; content: string }[] = [];
  const topic = form.topic.trim();
  const subject = form.subject.trim();

  const paraText = buildNotesOnly(enriched.summary, enriched.extract, enriched.academicParagraphs);
  const paragraphs = paraText.split(/\n\n+/).filter(Boolean);

  const sliceOr = (arr: string[], n: number) => (arr.length ? arr.slice(0, n) : []);

  blocks.push({ heading: `Introduction to ${topic}`, content: sliceOr(paragraphs, 2).join("\n\n") });
  blocks.push({ heading: `Core Ideas in ${subject}`, content: sliceOr(paragraphs.slice(2), 3).join("\n\n") });
  blocks.push({ heading: `Applications and Evidence`, content: sliceOr(paragraphs.slice(5), 3).join("\n\n") });
  blocks.push({ heading: `Key Takeaways`, content: sliceOr(paragraphs.slice(8), 2).join("\n\n") });

  return blocks.filter((b) => b.content);
}

function mergeTerms(
  base: { term: string; definition: string }[],
  extra?: { term: string; definition: string }[],
) {
  if (!extra || extra.length === 0) return base;
  const seen = new Set(base.map((t) => t.term.toLowerCase()));
  const merged = [...base];
  for (const t of extra) {
    if (!seen.has(t.term.toLowerCase())) {
      merged.push(t);
      seen.add(t.term.toLowerCase());
    }
    if (merged.length >= 8) break;
  }
  return merged;
}

function getTopicOptions(subject: string) {
  const s = subject.toLowerCase();
  if (!s) return genericTopicOptions;
  if (s.includes("econom")) return [
    "Monetary Policy", "Fiscal Policy", "Elasticity", "Market Failure", "Game Theory", "Regression Analysis", "Hypothesis Testing", "Time Series", "Portfolio Theory", "Derivatives"
  ];
  if (s.includes("computer") || s.includes("data") || s.includes("ai") || s.includes("machine")) return [
    "Algorithm Design", "Operating Systems", "Computer Networks", "Database Normalisation", "Machine Learning", "Neural Networks", "Time Complexity", "Distributed Systems", "Information Retrieval", "Security"
  ];
  if (s.includes("bio") || s.includes("med") || s.includes("pharma")) return [
    "Protein Structure", "Enzyme Kinetics", "Cell Cycle", "DNA Replication", "Clinical Trials", "Epidemiology", "Pharmacokinetics", "Signal Transduction", "Metabolism", "Genetics"
  ];
  if (s.includes("physics") || s.includes("chem") || s.includes("math")) return [
    "Thermodynamics", "Quantum Mechanics", "Electromagnetism", "Statistical Inference", "Regression Analysis", "Numerical Methods", "Complex Analysis", "Group Theory", "Heat Transfer", "Fluid Mechanics"
  ];
  if (s.includes("law")) return [
    "Constitutional Law", "Contract Law", "Torts", "EU Law", "International Law", "Criminal Law", "Land Law", "Equity & Trusts", "Company Law", "Human Rights Law"
  ];
  if (s.includes("psychology")) return [
    "Cognitive Psychology", "Social Psychology", "Developmental Psychology", "Biopsychology", "Research Methods", "Psychometrics", "Learning & Memory", "Perception", "Emotion", "Personality"
  ];
  if (s.includes("engineering")) return [
    "Structural Analysis", "Control Systems", "Materials", "Fluid Mechanics", "Heat Transfer", "Dynamics", "Signal Processing", "Power Systems", "Manufacturing", "Design Optimisation"
  ];
  return genericTopicOptions;
}

function buildAcademicTerms(enriched: {
  summary?: string;
  extract?: string;
  terms?: { term: string; definition: string }[];
}) {
  const collected: { term: string; definition: string }[] = [];
  if (enriched?.terms?.length) {
    collected.push(...enriched.terms);
  }
  // Fallback: derive a couple of terms from the extract by taking capitalized phrases
  const text = (enriched?.extract || enriched?.summary || "").slice(0, 1200);
  const matches = text.match(/([A-Z][A-Za-z0-9-]*(?:\s+[A-Z][A-Za-z0-9-]*){0,3})/g) || [];
  for (const m of matches) {
    const term = m.trim();
    if (term.length < 3 || term.split(" ").length > 4) continue;
    if (/^(The|A|An|And|Or|Of|In|On|For|With|By|From)$/i.test(term)) continue;
    const definition = `A concept referenced in the literature related to the topic.`;
    if (!collected.some((t) => t.term.toLowerCase() === term.toLowerCase())) {
      collected.push({ term, definition });
    }
    if (collected.length >= 6) break;
  }
  return collected.slice(0, 6);
}

function buildMisunderstandings(
  form: FormState,
  enriched: { summary?: string; extract?: string },
) {
  const topic = form.topic.trim();
  return [
    `Confusing ${topic} with a related but distinct concept; define terms precisely.`,
    `Assuming correlations in the literature imply causation without identification.`,
    `Overgeneralising findings beyond the context/population studied.`,
    `Ignoring key assumptions of standard models or diagrams when interpreting outcomes.`,
    `Neglecting measurement units, scales, or sign conventions in quantitative work.`,
  ];
}

function buildDefinitions(
  enriched: { terms?: { term: string; definition: string }[]; extract?: string; summary?: string },
  minimum = 10,
) {
  const defs: { term: string; definition: string }[] = [];
  if (enriched.terms?.length) defs.push(...enriched.terms);
  // Further derive candidates from the extract by simple heuristics
  const text = (enriched.extract || enriched.summary || "").slice(0, 4000);
  const candidates = Array.from(
    new Set(
      (text.match(/([A-Z][A-Za-z0-9-]*(?:\s+[A-Z][A-Za-z0-9-]*){0,3})/g) || [])
        .map((x) => x.trim())
        .filter((x) => x.length >= 3 && x.split(" ").length <= 4),
    ),
  );
  for (const c of candidates) {
    if (defs.length >= minimum) break;
    if (!defs.some((d) => d.term.toLowerCase() === c.toLowerCase())) {
      defs.push({ term: c, definition: `A term frequently appearing in topic sources; define precisely for context.` });
    }
  }
  // Ensure minimum count
  while (defs.length < minimum) {
    defs.push({ term: `Key Term ${defs.length + 1}`, definition: `Provide a concise, discipline-appropriate definition.` });
  }
  return defs.slice(0, Math.max(minimum, defs.length));
}

function buildModelEssay(
  form: FormState,
  enriched: { summary?: string; extract?: string; citations?: { title: string; year?: string; doi?: string; url?: string }[] },
) {
  const subject = form.subject.trim();
  const topic = form.topic.trim();
  const uni = form.university ? ` at ${form.university}` : "";
  const year = form.year ? ` (${form.year})` : "";
  const q = getCommonQuestion(subject, topic, uni, year);

  const base = (enriched.extract || enriched.summary || "").split("\n").filter(Boolean);
  const simplified = base
    .map((p) => simplifyText(p)[0])
    .filter(Boolean)
    .slice(0, 6);

  const intro = `Introduction: This essay explains ${topic} in ${subject}${uni}${year}. It gives a clear definition, how it works, a UK-relevant example, and a short evaluation.`;
  const defn = `Definition: ${topic} is explained in plain language so a beginner can follow. Use 1–2 sentences and avoid jargon.`;
  const mech = `Mechanism: Describe how ${topic} works in 2–3 simple steps. If a diagram is standard in ${subject}, describe it in words (axes, shifts, outcome).`;
  const app = `Application (UK/${form.university || "UK"}): Give a short example showing ${topic} in practice, with a clear outcome or data point if available.`;
  const evaln = `Evaluation: State two strengths and two limitations. Link each point back to the question and context.`;
  const concl = `Conclusion: Sum up the main insight in one short paragraph. Be balanced and context-aware.`;

  const essay = [intro, defn, mech, app, ...simplified.slice(0, 2), evaln, concl].join("\n\n");

  return {
    question: q,
    essay,
    references: enriched.citations?.slice(0, 3),
  };
}

function getCommonQuestion(subject: string, topic: string, uni: string, year: string) {
  const s = subject.toLowerCase();
  if (s.includes("econom")) return `Explain and evaluate ${topic} within ${subject}${uni}${year}, including a brief UK example.`;
  if (s.includes("law")) return `Critically discuss ${topic} in ${subject}${uni}${year}, referencing key authorities and policy implications.`;
  if (s.includes("computer") || s.includes("data") || s.includes("ai") || s.includes("machine")) return `Describe and evaluate ${topic} for ${subject}${uni}${year}, including core steps and one real application.`;
  if (s.includes("psycholog")) return `Explain ${topic} in ${subject}${uni}${year}, summarising core theories and one UK-based study. Evaluate strengths and limits.`;
  if (s.includes("bio") || s.includes("med") || s.includes("pharma")) return `Describe the role of ${topic} in ${subject}${uni}${year}, outlining mechanism and one clinical/experimental example.`;
  return `Discuss ${topic} in ${subject}${uni}${year}, covering definition, mechanism, application, and evaluation.`;
}

function generateNotes(form: FormState) {
  const subject = form.subject.trim();
  const topic = form.topic.trim();
  const uniSuffix = form.university ? ` at ${form.university}` : "";
  const yearSuffix = form.year ? ` (${form.year})` : "";

  const title = `${subject} – ${topic}${uniSuffix}${yearSuffix}`;

  return {
    title,
    detailedSummary:
      [
        `🧭 Overview`,
        `This page provides a thorough, exam-focused explanation of ${topic} within ${subject}${uniSuffix}${yearSuffix}.`,
        `1) Concept foundation: define the term precisely, outline its theoretical basis, and situate it in the wider module.`,
        `2) Mechanism/process: describe how it works step-by-step. Include any equations, causal chains, or graphical intuition.`,
        `3) Applications: show how ${topic} is applied in real or UK-relevant contexts (policy, industry, clinical, case studies).`,
        `4) Evaluation: strengths vs. limitations, underlying assumptions, boundary conditions, and empirical evidence.`,
        `5) Exam strategy: structure answers with definition → explanation → application → evaluation, and signpost throughout.`,
        ``,
        `Core explanation`,
        `• Definition: Provide a concise, one-sentence definition of ${topic}.`,
        `• Frameworks: Identify key models/theories used to analyse ${topic}.`,
        `• Quantitative/diagrammatic tools: Explain the standard diagram(s) or formulae and how to interpret them.`,
        `• Evidence base: Mention 1–2 canonical studies or UK reports often cited.`,
        `• Limitations: Clarify where the framework breaks down and common sources of bias/error.`,
        ``,
        `Application & evaluation`,
        `• Application: Provide a brief applied example (UK or European context) with relevant data or outcomes.`,
        `• Counterpoint: Present an alternative explanation or competing model.`,
        `• Judgement: Offer a balanced conclusion that reflects context and evidence.`,
      ].join("\n\n"),
    terms: [
      { term: `${topic}`, definition: `A precise definition tailored to ${subject}, including scope and boundaries.` },
      { term: `Foundational Concept A`, definition: `Brief definition and why it matters for ${topic}.` },
      { term: `Foundational Concept B`, definition: `Brief definition and a simple example.` },
      { term: `Applied Metric`, definition: `How it is calculated/used, and interpretation caveats.` },
      { term: `Contrasting Concept`, definition: `What differs vs ${topic} and when to use each.` },
    ],
    qa: [
      {
        question: `Define ${topic} and explain its core mechanism (8–10 marks).`,
        answer:
          `Definition: Provide a clear, one-sentence definition.\n` +
          `Mechanism: Outline how it operates in 2–3 steps with references to any diagram/equation.\n` +
          `Link: Relate the mechanism back to the broader ${subject} outcome/question.`,
      },
      {
        question: `Using a labelled diagram, illustrate a change related to ${topic}.`,
        answer:
          `Setup: Draw the standard diagram and label axes, curves, and equilibrium points.\n` +
          `Change: Show the shift and narrate the causal story step-by-step.\n` +
          `Insight: Explain the interpretation (comparative statics or qualitative conclusion).`,
      },
      {
        question: `Evaluate the strengths and limitations of ${topic} in practice.`,
        answer:
          `Strengths: List 2–3 compelling advantages or empirical successes.\n` +
          `Limitations: List 2–3 weaknesses, assumptions, or contexts where it fails.\n` +
          `Evaluation: Offer a balanced judgement dependent on context/evidence.`,
      },
      {
        question: `Apply ${topic} to a UK-relevant case study.`,
        answer:
          `Case: Briefly describe the UK case (sector/policy/clinical).\n` +
          `Application: Map ${topic} to the case with 1–2 data points.\n` +
          `Conclusion: Summarise the implications and any trade-offs.`,
      },
      {
        question: `Short answers: define two key terms precisely.`,
        answer:
          `Term 1: Provide a one-sentence definition.\n` +
          `Term 2: Provide a one-sentence definition.\n` +
          `Tip: Use concise wording and avoid circular definitions.`,
      },
    ],
  } as const;
}



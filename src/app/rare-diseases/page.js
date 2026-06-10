'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';

/* ── Data ─────────────────────────────────────────────────────────── */

const CATEGORIES = [
  { name: 'All',             icon: '✦',  active: true  },
  { name: 'Neurological',   icon: '🧠' },
  { name: 'Cardiovascular', icon: '❤️' },
  { name: 'Metabolic',      icon: '⚗️' },
  { name: 'Musculoskeletal',icon: '🦴' },
  { name: 'Immunological',  icon: '🛡️' },
  { name: 'Genetic',        icon: '🧬' },
  { name: 'Haematological', icon: '🩸' },
  { name: 'Dermatological', icon: '🔬' },
];

const DISEASES = [
  { name: 'Amyloidosis',               abbr: '',    category: 'Metabolic',       slug: 'amyloidosis', wiki: 'Amyloidosis' },
  { name: 'Batten Disease',             abbr: '',    category: 'Neurological',    slug: 'batten-disease', wiki: 'Batten_disease' },
  { name: 'Charcot-Marie-Tooth',        abbr: 'CMT', category: 'Neurological',    slug: 'charcot-marie-tooth', wiki: 'Charcot–Marie–Tooth_disease' },
  { name: 'Diamond-Blackfan Anemia',    abbr: 'DBA', category: 'Haematological',  slug: 'diamond-blackfan-anemia', wiki: 'Diamond–Blackfan_anemia' },
  { name: 'Ehlers-Danlos Syndrome',     abbr: 'EDS', category: 'Musculoskeletal', slug: 'ehlers-danlos-syndrome', wiki: 'Ehlers–Danlos_syndromes' },
  { name: 'Fabry Disease',              abbr: '',    category: 'Metabolic',       slug: 'fabry-disease', wiki: 'Fabry_disease' },
  { name: 'Gaucher Disease',            abbr: '',    category: 'Metabolic',       slug: 'gaucher-disease', wiki: 'Gaucher_disease' },
  { name: 'Huntington\'s Disease',      abbr: 'HD',  category: 'Neurological',    slug: 'huntingtons-disease', wiki: 'Huntington%27s_disease' },
  { name: 'Ichthyosis',                 abbr: '',    category: 'Dermatological',  slug: 'ichthyosis', wiki: 'Ichthyosis' },
  { name: 'Juvenile Arthritis',         abbr: 'JIA', category: 'Immunological',   slug: 'juvenile-idiopathic-arthritis', wiki: 'Juvenile_idiopathic_arthritis' },
  { name: 'Kawasaki Disease',           abbr: '',    category: 'Cardiovascular',  slug: 'kawasaki-disease', wiki: 'Kawasaki_disease' },
  { name: 'Lupus (Systemic)',           abbr: 'SLE', category: 'Immunological',   slug: 'lupus', wiki: 'Systemic_lupus_erythematosus' },
  { name: 'Marfan Syndrome',            abbr: '',    category: 'Cardiovascular',  slug: 'marfan-syndrome', wiki: 'Marfan_syndrome' },
  { name: 'Neurofibromatosis',          abbr: 'NF1', category: 'Neurological',    slug: 'neurofibromatosis', wiki: 'Neurofibromatosis' },
  { name: 'Osteogenesis Imperfecta',    abbr: 'OI',  category: 'Musculoskeletal', slug: 'osteogenesis-imperfecta', wiki: 'Osteogenesis_imperfecta' },
  { name: 'Progeria',                   abbr:'HGPS', category: 'Genetic',         slug: 'progeria', wiki: 'Progeria' },
  { name: 'Pulmonary Hypertension',     abbr: 'PH',  category: 'Cardiovascular',  slug: 'pulmonary-hypertension', wiki: 'Pulmonary_hypertension' },
  { name: 'Sickle Cell Disease',        abbr: 'SCD', category: 'Haematological',  slug: 'sickle-cell-disease', wiki: 'Sickle_cell_disease' },
  { name: 'Tuberous Sclerosis',         abbr: 'TSC', category: 'Neurological',    slug: 'tuberous-sclerosis-complex', wiki: 'Tuberous_sclerosis' },
  { name: 'Usher Syndrome',             abbr: '',    category: 'Genetic',         slug: 'usher-syndrome', wiki: 'Usher_syndrome' },
  { name: 'Von Hippel-Lindau',          abbr: 'VHL', category: 'Genetic',         slug: 'von-hippel-lindau-disease', wiki: 'Von_Hippel–Lindau_disease' },
  { name: 'Wilson Disease',             abbr: '',    category: 'Metabolic',       slug: 'wilson-disease', wiki: 'Wilson%27s_disease' },
  { name: 'Xeroderma Pigmentosum',      abbr: 'XP',  category: 'Dermatological',  slug: 'xeroderma-pigmentosum', wiki: 'Xeroderma_pigmentosum' },
  { name: 'Pompe Disease',              abbr: '',    category: 'Metabolic',       slug: 'pompe-disease', wiki: 'Pompe_disease' },
];

const NEWS_ARTICLES = [
  {
    title: 'FDA Approves Breakthrough Gene Therapy for Rare Metabolic Disorder',
    excerpt: 'The FDA has granted accelerated approval to a novel gene therapy targeting a rare metabolic condition. Clinical trials showed an 80% reduction in disease markers within 12 months.',
    content: 'In a landmark decision today, the FDA has granted accelerated approval to a novel gene therapy targeting a rare metabolic condition that affects fewer than 1 in 100,000 infants globally. Clinical trials showed an unprecedented 80% reduction in progressive disease markers within 12 months of a single intravenous infusion.\n\n"This represents a paradigm shift in how we treat metabolic disorders," said Dr. Aris Thorne, lead investigator of the multi-center trial. "Historically, we could only manage symptoms and provide palliative care. Now, we are directly correcting the underlying genetic defect."\n\nThe therapy utilizes an AAV9 viral vector to deliver a functional copy of the missing gene directly to the patient\'s liver cells. Follow-up studies will continue to monitor long-term durability, but early patients have already regained critical motor milestones previously thought impossible to recover.',
    tag: 'FDA Approval', tagColor: '#e8f5e9', tagText: '#2e7d32',
    date: 'Jun 7, 2025', source: 'Global Genes RARE Daily',
    url: 'https://globalgenes.org/rare-daily/', icon: '💊',
  },
  {
    title: 'NIH Launches $150M Initiative to Accelerate Rare Disease Research',
    excerpt: 'A major NIH funding initiative targets diseases with limited treatment options, prioritizing pediatric rare conditions and supporting over 300 research programs nationwide.',
    content: 'The National Institutes of Health (NIH) has officially launched a $150 million funding initiative designed exclusively to accelerate research into rare and ultra-rare diseases. The grant program will prioritize pediatric conditions with currently no approved FDA treatments.\n\nOver the next five years, the initiative will establish four new Centers of Excellence across the United States. These centers will serve as collaborative hubs where academic researchers, pharmaceutical developers, and patient advocacy groups can share data in real-time without traditional institutional barriers.\n\n"The traditional funding model is too slow for children racing against the clock," an NIH spokesperson stated. "This initiative cuts the red tape and brings the best minds together to focus purely on translational science and rapid clinical deployment." Over 300 pilot research programs are expected to receive seed funding in the first wave.',
    tag: 'Research Funding', tagColor: '#e3f2fd', tagText: '#1565c0',
    date: 'May 28, 2025', source: 'NORD',
    url: 'https://rarediseases.org/', icon: '🔬',
  },
  {
    title: 'AI Cuts Rare Disease Diagnosis Time from 4.8 Years to 8 Months',
    excerpt: 'A landmark study in Nature Medicine reveals that AI-powered diagnostic tools dramatically reduced the diagnostic odyssey for patients with undiagnosed rare diseases.',
    content: 'The notoriously exhausting "diagnostic odyssey" for rare disease patients—which historically averages nearly 5 years and involves visits to over 7 different specialists—may soon be a relic of the past, thanks to artificial intelligence.\n\nA new landmark study published in Nature Medicine analyzed the outcomes of 4,000 pediatric patients. By implementing an AI-powered diagnostic tool that cross-references a patient\'s full electronic health record, genomic sequencing data, and global phenotype databases in seconds, researchers were able to cut the average time to diagnosis from 4.8 years down to just 8 months.\n\nThe algorithm identified subtle phenotypic patterns that human clinicians had overlooked, leading to accurate diagnoses for 34% of patients who had previously been classified as "undiagnosed." Hospitals across Europe and North America are now piloting the software in their genetics departments.',
    tag: 'AI & Technology', tagColor: '#ede7f6', tagText: '#4527a0',
    date: 'Apr 15, 2025', source: 'NORD',
    url: 'https://rarediseases.org/', icon: '🤖',
  },
  {
    title: 'Community Voices: Living with Ehlers-Danlos Syndrome',
    excerpt: 'Patients share their experiences navigating EDS diagnosis, treatment delays, and the lifeline of finding community among others who truly understand their daily reality.',
    content: 'For decades, patients with Ehlers-Danlos Syndrome (EDS) have faced immense challenges in the medical system, often having their severe chronic pain and joint dislocations dismissed as anxiety or "growing pains." In this community spotlight, three patients share their journey from medical gaslighting to empowerment.\n\n"It took 14 years to get my diagnosis," shares Sarah M., a 28-year-old advocate. "When a geneticist finally told me I had hypermobile EDS, I cried—not because I was sick, but because I finally had proof that it wasn\'t just in my head."\n\nThe article highlights the critical importance of patient-led communities. For many with rare diseases, Facebook groups, specialized forums, and organizations like Beyond Rare serve as the primary source of practical day-to-day management advice. "Doctors can diagnose you," Sarah notes, "but your community teaches you how to survive."\n\nRead more about the ongoing advocacy efforts to mandate EDS education in medical schools.',
    tag: 'Patient Stories', tagColor: '#fce4ec', tagText: '#880e4f',
    date: 'May 21, 2025', source: 'Global Genes RARE Daily',
    url: 'https://globalgenes.org/rare-daily/', icon: '💬',
  },
  {
    title: 'Clinical Trial Opens for Huntington\'s Disease Gene Silencing',
    excerpt: 'A promising Phase III trial is now enrolling patients with early-stage Huntington\'s disease across 12 research centers in North America and Europe.',
    content: 'A highly anticipated Phase III clinical trial for an investigational gene-silencing drug has officially begun enrolling patients with early-stage Huntington\'s disease. The trial will take place across 12 specialized research centers in North America and Europe.\n\nHuntington\'s disease is caused by a toxic mutant protein that slowly destroys neurons. The new therapeutic approach utilizes antisense oligonucleotides (ASOs) designed to intercept the genetic instructions before the toxic protein can be manufactured by the body.\n\n"Phase II results were incredibly encouraging, showing a significant reduction of the mutant huntingtin protein in the cerebrospinal fluid," the lead trial coordinator explained. "If Phase III demonstrates that this biochemical reduction translates to a slowing of cognitive and motor decline, it will be the first disease-modifying treatment in history for this devastating condition." Enrollment is expected to close by the end of the year.',
    tag: 'Clinical Trial', tagColor: '#fff8e1', tagText: '#e65100',
    date: 'May 14, 2025', source: 'Global Genes RARE Daily',
    url: 'https://globalgenes.org/rare-daily/', icon: '🧪',
  },
  {
    title: 'Rare Disease Day 2025: Record 120 Countries Participate',
    excerpt: 'This year\'s Rare Disease Day saw unprecedented global participation, with awareness events, patient rallies, and policy discussions across 120 countries worldwide.',
    content: 'Rare Disease Day 2025 broke all previous records, with organized awareness events, patient rallies, and legislative policy discussions taking place across 120 countries.\n\nThe global theme for this year was "Equity in Healthcare." Major landmarks, including the Colosseum in Rome, the Empire State Building in New York, and the Burj Khalifa in Dubai, were illuminated in the official Rare Disease Day colors of pink, green, and blue.\n\nAt the United Nations headquarters in Geneva, patient advocates delivered a powerful keynote address urging member states to adopt the new WHO resolution on Universal Health Coverage for rare conditions. "Individually we are rare, but collectively we are 300 million strong," the closing speaker declared. The monumental turnout has already sparked commitments from several nations to increase their orphan drug budgets for the upcoming fiscal year.',
    tag: 'Advocacy', tagColor: '#e8eaf6', tagText: '#283593',
    date: 'Mar 1, 2025', source: 'NORD',
    url: 'https://rarediseases.org/', icon: '🌍',
  },
];

/* ── Component ────────────────────────────────────────────────────── */

export default function RareDiseases() {
  const [activeTab, setActiveTab] = useState('glossary');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [readerData, setReaderData] = useState(null);
  const [readerLoading, setReaderLoading] = useState(false);

  const openReader = async (disease) => {
    setSelectedDisease(disease);
    setReaderData(null);
    setReaderLoading(true);
    try {
      const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${disease.wiki}`);
      if (!res.ok) throw new Error('Not found');
      const data = await res.json();
      setReaderData(data);
    } catch (e) {
      setReaderData({ error: true });
    } finally {
      setReaderLoading(false);
    }
  };

  const filteredDiseases = useMemo(() => {
    return DISEASES.filter((d) => {
      const matchesCategory = selectedCategory === 'All' || d.category === selectedCategory;
      const matchesSearch = !searchQuery || d.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `https://rarediseases.org/rare-diseases/?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="flex flex-col w-full bg-brand-cream">

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section
        className="relative w-full overflow-hidden px-6 md:px-12 lg:px-24 pt-14 pb-10"
        style={{ background: '#f5f2ee' }}
      >
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'url(/images/5.avif)',
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat',
          opacity: 0.45,
        }} />
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest bg-brand-purple/10 text-brand-purple-dark border border-brand-purple/20">
            🧬 Resource Hub
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold font-display leading-snug text-brand-purple-dark">
            Learn More About Rare Diseases
          </h1>
          <p className="text-base md:text-lg font-semibold leading-relaxed text-brand-purple-dark/80 max-w-2xl mx-auto">
            Search over 7,000 rare diseases, browse by category, or stay updated with the latest news and research breakthroughs.
          </p>

          {/* Tab Switcher */}
          <div className="flex items-center justify-center gap-3 pt-4">
            <button
              onClick={() => setActiveTab('glossary')}
              className={`flex items-center gap-2 px-7 py-3 rounded-full text-sm font-extrabold transition-all duration-200 ${
                activeTab === 'glossary'
                  ? 'bg-brand-purple text-white shadow-lg shadow-brand-purple/30'
                  : 'bg-white/60 text-brand-purple-dark hover:bg-white border border-brand-purple/20'
              }`}
            >
              📚 Disease Glossary
            </button>
            <button
              onClick={() => setActiveTab('news')}
              className={`flex items-center gap-2 px-7 py-3 rounded-full text-sm font-extrabold transition-all duration-200 ${
                activeTab === 'news'
                  ? 'bg-brand-green text-white shadow-lg shadow-brand-green/30'
                  : 'bg-white/60 text-brand-purple-dark hover:bg-white border border-brand-green/20'
              }`}
            >
              📰 News &amp; Events
            </button>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-8 pointer-events-none" style={{
          background: 'linear-gradient(to bottom, transparent, #d2e3d1)'
        }} />
      </section>

      {/* ── GLOSSARY TAB ─────────────────────────────────────────── */}
      {activeTab === 'glossary' && (
        <section className="relative bg-brand-green-light py-12 px-6 md:px-12 lg:px-24" style={{
          backgroundImage: 'url(/images/4.avif)',
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat',
        }}>
          <div className="relative z-10 max-w-6xl mx-auto space-y-8">

            {/* Search Bar */}
            <div className="text-center space-y-2">
              <p className="text-sm font-bold text-brand-purple-dark/70 uppercase tracking-widest">Search the NORD Database</p>
              <form onSubmit={handleSearch} className="flex items-center gap-3 max-w-2xl mx-auto">
                <div className="relative flex-1">
                  <svg className="absolute left-4 top-3.5 w-5 h-5 text-brand-purple/50 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); }}
                    placeholder="Search any rare disease… e.g. Marfan, Gaucher"
                    className="w-full pl-12 pr-4 py-3.5 rounded-full bg-white border border-brand-purple/15 text-brand-purple-dark placeholder-brand-purple-dark/40 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/30 shadow-sm"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3.5 bg-brand-purple text-white font-extrabold rounded-full text-sm hover:bg-brand-purple-dark transition shadow-md shrink-0 flex items-center gap-1.5"
                >
                  Search NORD
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                </button>
              </form>
              <p className="text-xs text-brand-purple-dark/50 font-semibold">Powered by the National Organization for Rare Disorders (NORD) · 1,200+ disease reports</p>
            </div>

            {/* Category Chips */}
            <div>
              <p className="text-xs font-extrabold uppercase tracking-widest text-brand-purple-dark/60 mb-3 text-center">Filter by Category</p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => { setSelectedCategory(cat.name); }}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-extrabold border transition-all duration-150 ${
                      selectedCategory === cat.name
                        ? 'bg-brand-purple text-white border-brand-purple shadow-md'
                        : 'bg-white/70 text-brand-purple-dark border-brand-purple/20 hover:bg-white hover:border-brand-purple/40'
                    }`}
                  >
                    <span>{cat.icon}</span> {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Disease Cards Grid */}
            <div>
              <p className="text-xs font-extrabold uppercase tracking-widest text-brand-purple-dark/60 mb-4 text-center">
                {filteredDiseases.length} {filteredDiseases.length === 1 ? 'Disease' : 'Diseases'} found
                {selectedCategory !== 'All' && ` · ${selectedCategory}`}
              </p>

              {filteredDiseases.length === 0 ? (
                <div className="text-center py-16 space-y-4">
                  <span className="text-5xl">🔭</span>
                  <p className="text-brand-purple-dark font-bold">No diseases match your filters.</p>
                  <button
                    onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
                    className="text-sm font-extrabold text-brand-purple hover:underline"
                  >
                    Clear all filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredDiseases.map((disease) => (
                    <button
                      key={disease.slug}
                      onClick={() => openReader(disease)}
                      className="group flex flex-col gap-2 p-4 text-left rounded-2xl bg-white/70 hover:bg-white border border-white/60 hover:border-brand-purple/20 hover:shadow-md transition-all duration-200 cursor-pointer"
                    >
                      <div className="flex items-start justify-between w-full">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-purple/60 bg-brand-purple/8 px-2 py-0.5 rounded-full">
                          {disease.category}
                        </span>
                        {disease.abbr && (
                          <span className="text-[10px] font-black text-brand-green-dark bg-brand-green-light px-2 py-0.5 rounded-full border border-brand-green/20">
                            {disease.abbr}
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-bold text-brand-purple-dark leading-snug group-hover:text-brand-purple transition-colors">
                        {disease.name}
                      </p>
                      
                      <span className="text-[11px] font-extrabold text-brand-purple flex items-center gap-1 mt-auto opacity-0 group-hover:opacity-100 transition-opacity pt-2">
                        Open Reader 📖
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Open Full NORD CTA */}
            <div className="text-center pt-4 border-t border-brand-purple/10 space-y-2">
              <p className="text-sm font-bold text-brand-purple-dark/70">Looking for a disease not listed here?</p>
              <a
                href="https://rarediseases.org/rare-diseases/"
                className="inline-flex items-center gap-2 px-8 py-3 bg-brand-purple hover:bg-brand-purple-dark text-white font-extrabold rounded-full text-sm shadow-md hover:shadow-lg transition-all duration-200"
              >
                Open Full NORD Database
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </section>
      )}

      {/* ── NEWS TAB ─────────────────────────────────────────────── */}
      {activeTab === 'news' && (
        <section className="relative bg-brand-green-light py-12 px-6 md:px-12 lg:px-24" style={{
          backgroundImage: 'url(/images/4.avif)',
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat',
        }}>
          <div className="relative z-10 max-w-6xl mx-auto space-y-8">

            {/* Section Header */}
            <div className="text-center space-y-2">
              <p className="text-sm font-bold text-brand-purple-dark/70 uppercase tracking-widest">Curated from trusted sources</p>
              <h2 className="text-3xl font-extrabold font-display text-brand-purple-dark">News &amp; Current Events</h2>
              <p className="text-sm text-brand-purple-dark/70 font-semibold max-w-xl mx-auto">
                Breakthrough research, FDA approvals, patient stories, and advocacy updates — sourced from Global Genes and NORD.
              </p>
            </div>

            {/* Article Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {NEWS_ARTICLES.map((article, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedArticle(article)}
                  className="group flex flex-col text-left gap-4 p-6 rounded-2xl bg-white/80 hover:bg-white border border-white/60 hover:border-brand-purple/15 hover:shadow-lg transition-all duration-200"
                >
                  {/* Icon + Tag + Date */}
                  <div className="flex items-start justify-between gap-2 w-full">
                    <span className="text-3xl">{article.icon}</span>
                    <div className="flex flex-col items-end gap-1">
                      <span
                        className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full"
                        style={{ background: article.tagColor, color: article.tagText }}
                      >
                        {article.tag}
                      </span>
                      <span className="text-[10px] text-brand-purple-dark/40 font-bold">{article.date}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-extrabold text-brand-purple-dark leading-snug group-hover:text-brand-purple transition-colors">
                    {article.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-xs text-brand-purple-dark/70 leading-relaxed font-semibold line-clamp-3 flex-1">
                    {article.excerpt}
                  </p>

                  {/* Source + CTA */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-auto w-full">
                    <span className="text-[10px] font-extrabold text-brand-purple-dark/50 uppercase tracking-wider">
                      {article.source}
                    </span>
                    <span className="text-xs font-extrabold text-brand-purple flex items-center gap-1 group-hover:gap-2 transition-all">
                      Read Article 📖
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Source CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4 border-t border-brand-purple/10">
              <a
                href="https://globalgenes.org/rare-daily/"
                className="inline-flex items-center gap-2 px-7 py-3 bg-brand-green hover:bg-brand-green-dark text-white font-extrabold rounded-full text-sm shadow-md hover:shadow-lg transition-all duration-200"
              >
                Open Global Genes RARE Daily ↗
              </a>
              <a
                href="https://rarediseases.org/for-patients-and-families/information-resources/news-patient-advocacy/"
                className="inline-flex items-center gap-2 px-7 py-3 bg-brand-purple hover:bg-brand-purple-dark text-white font-extrabold rounded-full text-sm shadow-md hover:shadow-lg transition-all duration-200"
              >
                Open NORD News ↗
              </a>
            </div>
          </div>
        </section>
      )}

      {/* ── STATS ────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden py-20 px-6 md:px-12"
        style={{
          backgroundImage: 'url(/images/rare_diseases_stats_bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#050d15]/80 via-[#0a1a20]/75 to-[#0d1520]/80 pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-brand-purple/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-teal-400/30 bg-teal-400/5 backdrop-blur-md">
              <span className="text-xs font-extrabold uppercase tracking-widest text-teal-300/80">Did You Know?</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black font-display text-white leading-tight">
              Rare by the <span style={{ color: '#5eead4' }}>Numbers</span>
            </h2>
            <p className="text-white/60 font-semibold text-sm max-w-xl mx-auto">
              The scale of rare disease reaches further than most people realize. Here is the reality.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { stat: '7,000+', label: 'Known Rare Diseases',  sub: 'Recognized worldwide',            icon: '🧬', color: 'from-purple-500/20 to-purple-700/5', border: 'border-purple-400/20' },
              { stat: '300M',   label: 'People Affected',       sub: 'Globally each year',              icon: '🌍', color: 'from-teal-500/20 to-teal-700/5',   border: 'border-teal-400/20'   },
              { stat: '1 in 10',label: 'US Individuals',        sub: 'Living with a rare disease',      icon: '🔬', color: 'from-emerald-500/20 to-emerald-700/5', border: 'border-emerald-400/20' },
              { stat: '95%',    label: 'Without Treatment',     sub: 'Of rare diseases have no cure',   icon: '💊', color: 'from-violet-500/20 to-violet-700/5', border: 'border-violet-400/20'  },
            ].map(({ stat, label, sub, icon, color, border }) => (
              <div
                key={label}
                className={`relative p-6 rounded-2xl bg-gradient-to-br ${color} border ${border} flex flex-col gap-3`}
                style={{ backdropFilter: 'blur(24px)', background: 'rgba(255,255,255,0.04)' }}
              >
                <span className="text-3xl">{icon}</span>
                <p className="text-4xl font-black text-white leading-none">{stat}</p>
                <div>
                  <p className="text-sm font-extrabold text-white/90">{label}</p>
                  <p className="text-[11px] text-white/45 font-semibold mt-0.5">{sub}</p>
                </div>
                <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </div>
            ))}
          </div>

          <div className="text-center space-y-4">
            <p className="text-white/60 text-sm font-semibold">Knowledge is the first step. Community is the next.</p>
            <a
              href="/your-story"
              data-cta="join_our_community"
              className="inline-block px-10 py-3.5 bg-brand-purple hover:bg-brand-purple-dark text-white font-extrabold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-sm"
            >
              Join Our Community →
            </a>
          </div>
        </div>
      </section>

      {/* ── READER DRAWER (Slide-over) ────────────────── */}
      <div 
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${(selectedDisease || selectedArticle) ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-[#0a0514]/40 backdrop-blur-sm"
          onClick={() => { setSelectedDisease(null); setSelectedArticle(null); }}
        />
        
        {/* Drawer Panel */}
        <div 
          className={`absolute inset-y-0 right-0 w-full md:w-[600px] lg:w-[800px] bg-white shadow-2xl transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col ${(selectedDisease || selectedArticle) ? 'translate-x-0' : 'translate-x-full'}`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-brand-purple/10 bg-brand-cream/50 shrink-0">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 flex items-center justify-center rounded-full bg-brand-purple/10 text-brand-purple">
                📖
              </span>
              <h3 className="text-lg font-black font-display text-brand-purple-dark truncate max-w-[200px] md:max-w-[400px]">
                {selectedDisease?.name || selectedArticle?.title || 'Reading Mode'}
              </h3>
            </div>
            
            <button 
              onClick={() => { setSelectedDisease(null); setSelectedArticle(null); }}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-black/5 hover:bg-black/10 text-black/60 transition-colors"
              aria-label="Close reader"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Reader Content - Wikipedia Disease Summary */}
          {selectedDisease && (
            <div className="flex-1 bg-white overflow-y-auto">
              {readerLoading && (
                <div className="p-8 space-y-6 animate-pulse max-w-3xl mx-auto">
                  <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-64 bg-gray-100 rounded-xl w-full"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </div>
              )}

              {!readerLoading && readerData && !readerData.error && (
                <div className="p-8 max-w-3xl mx-auto space-y-8 pb-32">
                  <div className="space-y-2">
                    <span className="text-xs font-extrabold uppercase tracking-widest text-brand-purple/60 bg-brand-purple/10 px-3 py-1 rounded-full">
                      {selectedDisease.category}
                    </span>
                    <h2 className="text-4xl font-black font-display text-brand-purple-dark leading-tight pt-2">
                      {readerData.title}
                    </h2>
                    <p className="text-sm font-semibold text-brand-purple-dark/50">
                      Sourced from Wikipedia Encyclopedia
                    </p>
                  </div>

                  {readerData.thumbnail && (
                    <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-gray-50 flex items-center justify-center p-4">
                      <img 
                        src={readerData.thumbnail.source} 
                        alt={readerData.title}
                        className="max-h-[300px] object-contain mix-blend-multiply" 
                      />
                    </div>
                  )}

                  <div className="prose prose-purple max-w-none">
                    <p className="text-lg leading-relaxed text-brand-purple-dark/80 font-medium">
                      {readerData.extract}
                    </p>
                  </div>

                  {/* Footer CTA */}
                  <div className="mt-12 p-6 bg-brand-green-light rounded-2xl border border-brand-green/20 flex flex-col sm:flex-row items-center gap-6 justify-between">
                    <div className="space-y-1">
                      <h4 className="text-base font-extrabold text-brand-purple-dark">Read Full Medical Report</h4>
                      <p className="text-sm font-semibold text-brand-purple-dark/70">
                        View comprehensive symptoms, causes, and treatments on NORD's database.
                      </p>
                    </div>
                    <a 
                      href={`https://rarediseases.org/rare-diseases/${selectedDisease.slug}/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 px-6 py-3 bg-brand-purple hover:bg-brand-purple-dark text-white text-sm font-extrabold rounded-full transition-colors flex items-center gap-2 shadow-md hover:shadow-lg"
                    >
                      Open NORD ↗
                    </a>
                  </div>
                </div>
              )}

              {!readerLoading && readerData?.error && (
                <div className="p-16 text-center space-y-4 flex flex-col items-center justify-center h-full">
                  <span className="text-5xl">📄</span>
                  <h2 className="text-xl font-bold text-brand-purple-dark">Summary Not Available</h2>
                  <p className="text-sm text-brand-purple-dark/70 max-w-md mx-auto">
                    We couldn't fetch a quick summary for this disease right now. 
                    You can read the full, comprehensive medical report directly on the NORD database.
                  </p>
                  <a 
                    href={`https://rarediseases.org/rare-diseases/${selectedDisease.slug}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 px-8 py-3 bg-brand-purple hover:bg-brand-purple-dark text-white text-sm font-extrabold rounded-full transition-colors flex items-center gap-2"
                  >
                    Read Full Report on NORD ↗
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Reader Content - News Article */}
          {selectedArticle && (
            <div className="flex-1 bg-white overflow-y-auto">
              <div className="p-8 max-w-3xl mx-auto space-y-8 pb-32">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span
                      className="text-xs font-extrabold uppercase tracking-wider px-3 py-1.5 rounded-full"
                      style={{ background: selectedArticle.tagColor, color: selectedArticle.tagText }}
                    >
                      {selectedArticle.tag}
                    </span>
                    <span className="text-sm font-bold text-brand-purple-dark/40">{selectedArticle.date}</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black font-display text-brand-purple-dark leading-tight pt-2">
                    {selectedArticle.title}
                  </h2>
                  <div className="flex items-center gap-2 pb-4 border-b border-brand-purple/10">
                    <span className="text-2xl">{selectedArticle.icon}</span>
                    <p className="text-sm font-semibold text-brand-purple-dark/50">
                      Published by <span className="font-bold text-brand-purple-dark/70">{selectedArticle.source}</span>
                    </p>
                  </div>
                </div>

                <div className="prose prose-purple max-w-none">
                  <p className="text-lg leading-relaxed text-brand-purple-dark/80 font-medium whitespace-pre-wrap">
                    {selectedArticle.content}
                  </p>
                </div>

                {/* Footer CTA */}
                <div className="mt-12 p-6 bg-brand-cream rounded-2xl border border-brand-purple/10 flex flex-col sm:flex-row items-center gap-6 justify-between">
                  <div className="space-y-1">
                    <h4 className="text-base font-extrabold text-brand-purple-dark">Read Original Publication</h4>
                    <p className="text-sm font-semibold text-brand-purple-dark/70">
                      View the source article and citations on {selectedArticle.source}.
                    </p>
                  </div>
                  <a 
                    href={selectedArticle.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 px-6 py-3 bg-brand-purple hover:bg-brand-purple-dark text-white text-sm font-extrabold rounded-full transition-colors flex items-center gap-2 shadow-md hover:shadow-lg"
                  >
                    Open Source ↗
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

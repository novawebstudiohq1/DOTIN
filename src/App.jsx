import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Check,
  Camera,
  Clapperboard,
  Clock3,
  Mail,
  Menu,
  MessageCircle,
  MoveRight,
  Play,
  Plus,
  Sparkles,
  X,
} from 'lucide-react'
import { categories, portfolioItems } from './data/portfolioData'

// Niches shown in the looping marquee. Not a filter: with six films the counts
// per niche are too lopsided for filtering to be useful, so this just signals
// the range of work we take on.
const niches = categories
  .filter((category) => category.id !== 'all')
  .map((category) => category.label.split('//')[0].trim())

const features = [
  { number: '01', icon: Sparkles, title: 'Conversion-first ideas', text: 'Spec promo ads built around the one visual hook your audience remembers.' },
  { number: '02', icon: Clapperboard, title: 'Cinematic craft', text: 'Intentional art direction, movement, and color that make every frame earn its place.' },
  { number: '03', icon: MoveRight, title: 'Built for momentum', text: 'Fast, collaborative production designed for modern launch calendars and social feeds.' },
]

const processSteps = [
  { number: '01', title: 'Concept', text: 'We find the tension, hook, and visual language that makes the idea impossible to scroll past.' },
  { number: '02', title: 'Storyboard', text: 'Every beat is mapped before the camera rolls, so the finished film feels effortless.' },
  { number: '03', title: 'Production', text: 'A focused crew brings the concept to life with precise light, movement, and performance.' },
  { number: '04', title: 'Delivery', text: 'Polished master files and cutdowns arrive ready for every channel, screen, and launch.' },
]

const packages = [
  { name: 'Hook Reels', label: 'For the scroll-stopper', price: 'From ₹35k', description: 'Short-form product films engineered for attention in the first three seconds.', features: ['1 x 15s vertical film', 'Concept + shot list', 'One production day', '2 revision rounds'] },
  { name: 'Brand Commercials', label: 'For the flagship moment', price: 'From ₹1.2L', description: 'A cinematic brand film with the ambition and finish to define a campaign.', features: ['30–60s hero film', 'Full pre-production', 'Cinematic production day', 'Master + social cutdowns'], featured: true },
  { name: 'Launch Bundles', label: 'For the full rollout', price: 'From ₹2.4L', description: 'A connected suite of assets that gives every launch touchpoint a pulse.', features: ['Hero film + 4 cutdowns', 'Campaign visual system', 'Two production days', 'Priority delivery'] },
]

const faqs = [
  { question: 'How quickly can we turn a project around?', answer: 'Most Hook Reel projects move from brief to final delivery in 10–14 working days. Larger commercials typically take 3–5 weeks depending on locations, talent, and post-production.' },
  { question: 'How many revision rounds are included?', answer: 'Every package includes two focused revision rounds. We use a clear review link and consolidated feedback to keep momentum high and decisions simple.' },
  { question: 'Can you develop a concept from scratch?', answer: 'Absolutely. Concept development is at the heart of DOTIN. We can start from a product, a loose brief, or a feeling you want the audience to have.' },
  { question: 'Do you work with brands outside Mumbai?', answer: 'Yes. Our core team is based in Mumbai, and we regularly produce across India. For international projects, we build a local crew around the same creative direction.' },
]

const revealEase = [0.22, 1, 0.36, 1]
const revealVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}
const staggerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

function Reveal({ children, className = '', delay = 0 }) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      className={className}
      initial={prefersReducedMotion ? false : 'hidden'}
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={revealVariants}
      transition={{ duration: 0.72, delay: prefersReducedMotion ? 0 : delay, ease: revealEase }}
    >
      {children}
    </motion.div>
  )
}

function App() {
  const [activeModalItem, setActiveModalItem] = useState(null)
  const [activeDriveItem, setActiveDriveItem] = useState(null)
  const [isContactOpen, setIsContactOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [isDriveLoading, setIsDriveLoading] = useState(false)
  const [activeDriveIndex, setActiveDriveIndex] = useState(0)
  const [isWorkScrollable, setIsWorkScrollable] = useState(false)
  const workScrollRef = useRef(null)
  const prefersReducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const heroImageY = useTransform(scrollYProgress, [0, 0.25], [0, 46])
  const heroImageScale = useTransform(scrollYProgress, [0, 0.25], [1, 1.035])

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        setActiveModalItem(null)
        setActiveDriveItem(null)
        setIsContactOpen(false)
        setMenuOpen(false)
      }
    }
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [])

  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)

    const enableSmoothScroll = () => document.documentElement.setAttribute('data-scroll-ready', 'true')

    if (document.readyState === 'complete') {
      const timer = window.setTimeout(enableSmoothScroll, 150)
      return () => window.clearTimeout(timer)
    }

    window.addEventListener('load', enableSmoothScroll, { once: true })
    return () => window.removeEventListener('load', enableSmoothScroll)
  }, [])

  useEffect(() => {
    const element = workScrollRef.current
    if (!element) return undefined

    const measure = () => setIsWorkScrollable(element.scrollHeight - element.clientHeight > 8)
    measure()

    const observer = new ResizeObserver(measure)
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  const isOverlayOpen = Boolean(activeModalItem || activeDriveItem || isContactOpen)

  useEffect(() => {
    if (!isOverlayOpen) return undefined
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isOverlayOpen])

  const getDriveIds = (item) => item?.driveFileIds ?? []

  const closeDrivePreview = () => {
    setActiveDriveItem(null)
    setIsDriveLoading(false)
    setActiveDriveIndex(0)
  }

  const playDriveFilm = (item, index = 0) => {
    setActiveDriveIndex(index)
    setIsDriveLoading(true)
    setActiveDriveItem(item)
  }

  const openProject = (item) => {
    if (getDriveIds(item).length > 0) {
      playDriveFilm(item, 0)
      return
    }
    setActiveModalItem(item)
  }

  const getFrames = (item) => {
    const frames = [...item.storyboard]
    while (frames.length < 4) {
      frames.push({
        frame: `0${frames.length + 1}. Closing Frame`,
        detail: 'Product lock-up with a final, confident call to action',
        image: item.thumbnail,
      })
    }
    return frames.slice(0, 4)
  }

  return (
    <div className="min-h-screen overflow-x-clip bg-zinc-950 text-zinc-100">
      <motion.header initial={prefersReducedMotion ? false : { y: -18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, ease: revealEase }} className="fixed inset-x-0 top-0 z-40 border-b border-zinc-800/80 bg-zinc-950/85 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 lg:px-8">
          <a href="#top" className="text-xl font-bold tracking-[-0.08em]">DOTIN<span className="text-blue-500">.</span></a>
          <nav className="hidden items-center gap-9 text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-400 md:flex">
            {['Work', 'Process', 'Services', 'FAQ'].map((link) => <a className="transition hover:text-white" href={`#${link.toLowerCase()}`} key={link}>{link}</a>)}
          </nav>
          <div className="flex items-center gap-3">
            <button onClick={() => setIsContactOpen(true)} className="hidden items-center gap-3 bg-blue-600 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] transition hover:bg-blue-500 sm:flex">Get Quote <ArrowUpRight size={14} /></button>
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 text-zinc-300 md:hidden" aria-label="Toggle menu">{menuOpen ? <X size={20} /> : <Menu size={20} />}</button>
          </div>
        </div>
        {menuOpen && <nav className="border-t border-zinc-800 bg-zinc-950 px-5 py-5 md:hidden"><div className="flex flex-col gap-5 text-xs uppercase tracking-[0.18em] text-zinc-400">{['Work', 'Process', 'Services', 'FAQ'].map((link) => <a onClick={() => setMenuOpen(false)} href={`#${link.toLowerCase()}`} key={link}>{link}</a>)}<button onClick={() => { setMenuOpen(false); setIsContactOpen(true) }} className="flex w-fit items-center gap-2 bg-blue-600 px-4 py-3 text-white">Get Quote <ArrowUpRight size={14} /></button></div></nav>}
      </motion.header>

      <main id="top" className="pt-[76px]">
        <motion.section initial={prefersReducedMotion ? false : 'hidden'} animate="visible" variants={revealVariants} transition={{ duration: 0.9, ease: revealEase }} className="relative mx-auto grid min-h-[720px] max-w-7xl items-center gap-12 px-5 py-20 lg:grid-cols-[.9fr_1.1fr] lg:px-8 lg:py-28">
          <div className="absolute left-1/2 top-0 h-px w-screen -translate-x-1/2 bg-zinc-800" />
          <Reveal className="relative z-10">
            <p className="mb-7 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500"><span className="h-1.5 w-1.5 rounded-full bg-blue-500 shadow-[0_0_14px_#2563eb]" /> Independent visual studio / Mumbai + worldwide</p>
            <h1 className="max-w-3xl text-[clamp(3.8rem,9vw,8rem)] font-bold uppercase leading-[.82] tracking-[-0.09em]">Make them<br /><span className="text-blue-500">look twice.</span></h1>
            <p className="mt-8 max-w-md text-sm leading-7 text-zinc-400">High-converting promo films and brand stories for products with something to say. We turn a sharp idea into a visual people feel.</p>
            <div className="mt-9 flex flex-wrap gap-3"><a href="#work" className="inline-flex items-center gap-5 bg-blue-600 px-5 py-3.5 text-[10px] font-semibold uppercase tracking-[0.17em] transition hover:bg-blue-500">Explore the work <ArrowDownRight size={16} /></a><a href="#process" className="inline-flex items-center gap-3 border border-zinc-700 px-5 py-3.5 text-[10px] font-semibold uppercase tracking-[0.17em] text-zinc-300 transition hover:border-zinc-500 hover:text-white">Our process <ArrowRight size={15} /></a></div>
            <div className="mt-16 flex flex-wrap gap-3"><div className="border border-zinc-800 bg-zinc-900 px-4 py-3"><strong className="block text-xl tracking-tight">60+</strong><span className="font-mono text-[9px] uppercase tracking-wider text-zinc-500">Films shipped</span></div><div className="border border-zinc-800 bg-zinc-900 px-4 py-3"><strong className="block text-xl tracking-tight">4.8x</strong><span className="font-mono text-[9px] uppercase tracking-wider text-zinc-500">Avg. thumb stop</span></div><div className="border border-zinc-800 bg-zinc-900 px-4 py-3"><strong className="block text-xl tracking-tight">12</strong><span className="font-mono text-[9px] uppercase tracking-wider text-zinc-500">Cities captured</span></div></div>
          </Reveal>
          <motion.div style={prefersReducedMotion ? undefined : { y: heroImageY, scale: heroImageScale }} className="relative min-h-[400px] lg:min-h-[540px]">
            <div className="absolute inset-0 overflow-hidden bg-zinc-950">
              {prefersReducedMotion ? (
                <img src="/hero-poster.jpg" alt="" className="h-full w-full object-cover grayscale-[.15]" />
              ) : (
                <video
                  className="h-full w-full object-cover grayscale-[.15]"
                  src="/hero-film.mp4"
                  poster="/hero-poster.jpg"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  aria-hidden="true"
                  tabIndex={-1}
                />
              )}
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,rgba(9,9,11,.72),transparent_60%)]" />
            </div>
            <div className="absolute inset-0 border border-white/10" /><div className="absolute -left-4 top-8 font-mono text-[9px] uppercase tracking-[.2em] text-zinc-500 [writing-mode:vertical-rl]">19°04&apos; N / 72°52&apos; E</div><div className="absolute bottom-5 left-5 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[.2em] text-zinc-300"><Play size={12} fill="currentColor" className="text-blue-500" /> Showreel / 01:24</div><div className="absolute right-5 top-5 max-w-[100px] text-right text-[10px] uppercase leading-3 tracking-[.15em] text-zinc-300">Visual stories<br /><span className="text-blue-500">with a pulse.</span></div>
          </motion.div>
        </motion.section>

        <section className="border-y border-zinc-800/80 bg-zinc-950/80 py-6" aria-label="Agency value and stats">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-8 gap-y-4 px-5 lg:px-8">
            {[
              '4K Cinematic Production',
              '48-Hour Spec Concept Turnaround',
              'Optimized for Instagram Reels & YouTube Shorts',
              'Conversion-Focused Visual Hooks',
            ].map((highlight) => (
              <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider text-zinc-400" key={highlight}>
                <span className="h-2 w-2 shrink-0 rounded-full bg-blue-500 shadow-[0_0_12px_3px_rgba(59,130,246,0.55)]" />
                <span className="text-zinc-300">{highlight}</span>
              </div>
            ))}
          </div>
        </section>

        <motion.section initial={prefersReducedMotion ? false : 'hidden'} whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={revealVariants} transition={{ duration: 0.8, ease: revealEase }} className="border-y border-zinc-800 bg-zinc-900/35" id="about"><div className="mx-auto max-w-7xl px-5 py-24 lg:px-8"><Reveal className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-blue-500">Why DOTIN / 001</p><h2 className="mt-4 max-w-2xl text-4xl font-bold tracking-[-0.07em] sm:text-6xl">Attention is the<br /><span className="text-zinc-500">new currency.</span></h2></div><p className="max-w-xs text-sm leading-6 text-zinc-500">We make the kind of work that lives between a brand decision and a customer action.</p></Reveal><motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={staggerVariants} className="grid gap-px border border-zinc-800 bg-zinc-800 md:grid-cols-3">{features.map(({ number, icon: Icon, title, text }) => <motion.div variants={revealVariants} transition={{ duration: 0.6, ease: revealEase }} className="group bg-zinc-950 p-7 transition hover:bg-zinc-900" key={number}><div className="mb-14 flex items-center justify-between"><span className="font-mono text-xs text-zinc-600">{number}</span><Icon size={20} strokeWidth={1.3} className="text-blue-500 transition group-hover:rotate-12" /></div><h3 className="text-xl font-semibold tracking-tight">{title}</h3><p className="mt-3 text-sm leading-6 text-zinc-500">{text}</p></motion.div>)}</motion.div></div></motion.section>

        <motion.section initial={prefersReducedMotion ? false : 'hidden'} whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={revealVariants} transition={{ duration: 0.8, ease: revealEase }} className="mx-auto max-w-7xl px-5 py-24 lg:px-8 lg:py-32" id="work"><Reveal className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-blue-500">Selected work / 002</p><h2 className="mt-4 text-4xl font-bold tracking-[-0.07em] sm:text-6xl">Concepts in<br /><span className="text-zinc-500">motion.</span></h2></div><p className="max-w-xs text-sm leading-6 text-zinc-500">A library of visual directions built to make the thumb stop.</p></Reveal><Reveal className="mt-14" delay={0.08}>
          <div className="niche-marquee-mask relative overflow-hidden border-y border-zinc-800 py-4" role="group" aria-label="Niches we work with">
            <div className="niche-marquee">
              {[0, 1].map((pass) => (
                <ul className="flex shrink-0 items-center gap-8 pr-8" key={pass} aria-hidden={pass === 1 || undefined}>
                  {niches.map((niche) => (
                    <li className="flex shrink-0 items-center gap-3 font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500" key={niche}>
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                      {niche}
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>
        </Reveal><div ref={workScrollRef} className="work-scroller mt-5 max-h-[78vh] overflow-y-auto overscroll-contain px-1 py-2"><div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">{portfolioItems.map((item, index) => <motion.article initial={prefersReducedMotion ? false : 'hidden'} whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={revealVariants} transition={{ duration: 0.65, delay: prefersReducedMotion ? 0 : (index % 3) * 0.06, ease: revealEase }} className="group overflow-hidden border border-zinc-800 bg-zinc-900 transition duration-300 hover:-translate-y-1 hover:border-zinc-600" key={item.id}><button onClick={() => openProject(item)} className="block w-full text-left" aria-label={`Open ${item.title}`}><div className="relative aspect-[16/10] overflow-hidden"><img src={item.thumbnail} alt="" className="h-full w-full object-cover saturate-[.7] transition duration-700 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-black/10" /><span className="absolute left-4 top-4 font-mono text-[9px] tracking-wider text-zinc-300">{String(index + 1).padStart(2, '0')} / {String(portfolioItems.length).padStart(2, '0')}</span><span className="absolute bottom-4 right-4 flex translate-y-2 items-center gap-2 text-[9px] uppercase tracking-[0.14em] text-white opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">{getDriveIds(item).length > 0 ? 'Watch the film' : 'View storyboard'} <ArrowUpRight size={15} className="text-blue-400" /></span></div><div className="p-5"><div className="flex justify-between gap-3 font-mono text-[9px] uppercase tracking-[0.13em] text-zinc-500"><span>{item.categoryLabel}</span><span className="text-blue-500">{item.clientType}</span></div><h3 className="mt-5 text-lg font-semibold tracking-tight text-zinc-100">{item.title}</h3><p className="mt-2 text-xs text-zinc-500">{item.format}</p></div></button></motion.article>)}</div></div>{isWorkScrollable && <p className="mt-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500"><ArrowDownRight size={13} className="text-blue-500" /> Scroll inside the grid for more concepts</p>}</motion.section>

        <motion.section initial={prefersReducedMotion ? false : 'hidden'} whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={revealVariants} transition={{ duration: 0.8, ease: revealEase }} className="border-y border-zinc-800 bg-zinc-900/35" id="process"><div className="mx-auto max-w-7xl px-5 py-24 lg:px-8 lg:py-32"><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-blue-500">The way we work / 003</p><motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={staggerVariants} className="mt-5 grid gap-12 lg:grid-cols-[.7fr_1.3fr]"><Reveal><h2 className="text-4xl font-bold tracking-[-0.07em] sm:text-6xl">From first spark<br />to <span className="text-blue-500">final frame.</span></h2></Reveal><div className="grid border-t border-zinc-700 sm:grid-cols-2">{processSteps.map((step) => <motion.div variants={revealVariants} transition={{ duration: 0.6, ease: revealEase }} className="group border-b border-zinc-800 p-6 pl-0 sm:even:pl-6" key={step.number}><div className="mb-9 flex justify-between"><span className="font-mono text-xs text-blue-500">{step.number}</span><ArrowUpRight size={17} className="text-zinc-600 transition group-hover:text-blue-500" /></div><h3 className="text-xl font-semibold">{step.title}</h3><p className="mt-3 max-w-xs text-sm leading-6 text-zinc-500">{step.text}</p></motion.div>)}</div></motion.div></div></motion.section>

        <motion.section initial={prefersReducedMotion ? false : 'hidden'} whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={revealVariants} transition={{ duration: 0.8, ease: revealEase }} className="mx-auto max-w-7xl px-5 py-24 lg:px-8 lg:py-32" id="services"><Reveal className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-blue-500">Choose your scale / 004</p><h2 className="mt-4 text-4xl font-bold tracking-[-0.07em] sm:text-6xl">Make a little<br /><span className="text-zinc-500">noise.</span></h2></div><p className="max-w-xs text-sm leading-6 text-zinc-500">Simple packages. Serious craft. No mystery around what happens next.</p></Reveal><motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={staggerVariants} className="mt-14 grid gap-4 lg:grid-cols-3">{packages.map((pack) => <motion.article variants={revealVariants} transition={{ duration: 0.65, ease: revealEase }} className={`relative flex flex-col border p-7 ${pack.featured ? 'border-blue-600 bg-blue-600/[.08]' : 'border-zinc-800 bg-zinc-900'}`} key={pack.name}>{pack.featured && <span className="absolute right-5 top-5 bg-blue-600 px-2 py-1 font-mono text-[8px] uppercase tracking-[0.12em]">Most popular</span>}<p className="font-mono text-[10px] uppercase tracking-[0.16em] text-blue-500">{pack.label}</p><h3 className="mt-5 text-2xl font-semibold tracking-tight">{pack.name}</h3><p className="mt-3 min-h-12 text-sm leading-6 text-zinc-500">{pack.description}</p><p className="mt-8 border-t border-zinc-800 pt-5 text-lg font-semibold">{pack.price}</p><ul className="mt-6 space-y-3 border-t border-zinc-800 pt-6 text-sm text-zinc-400">{pack.features.map((feature) => <li className="flex items-center gap-3" key={feature}><Check size={15} className="text-blue-500" />{feature}</li>)}</ul><button onClick={() => setIsContactOpen(true)} className={`mt-9 flex items-center justify-between border px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] transition ${pack.featured ? 'border-blue-500 bg-blue-600 hover:bg-blue-500' : 'border-zinc-700 hover:border-blue-500 hover:text-blue-400'}`}>Select package <ArrowUpRight size={16} /></button></motion.article>)}</motion.div></motion.section>

        <motion.section initial={prefersReducedMotion ? false : 'hidden'} whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={revealVariants} transition={{ duration: 0.8, ease: revealEase }} className="border-y border-zinc-800 bg-zinc-900/35" id="faq"><div className="mx-auto max-w-5xl px-5 py-24 lg:px-8 lg:py-32"><Reveal className="text-center"><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-blue-500">No loose ends / 005</p><h2 className="mt-4 text-4xl font-bold tracking-[-0.07em] sm:text-6xl">Questions,<br /><span className="text-zinc-500">answered.</span></h2></Reveal><div className="mx-auto mt-14 max-w-3xl border-t border-zinc-700">{faqs.map((faq, index) => <motion.div initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.5, delay: prefersReducedMotion ? 0 : index * 0.05, ease: revealEase }} className="border-b border-zinc-800" key={faq.question}><button className="flex w-full items-center justify-between gap-6 py-6 text-left text-base font-medium" onClick={() => setOpenFaq(openFaq === index ? -1 : index)} aria-expanded={openFaq === index}><span><span className="mr-5 font-mono text-[10px] text-blue-500">0{index + 1}</span>{faq.question}</span>{openFaq === index ? <X size={17} className="shrink-0 text-blue-500" /> : <Plus size={17} className="shrink-0 text-zinc-500" />}</button><div className={`grid transition-[grid-template-rows] duration-300 ${openFaq === index ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}><p className="min-h-0 overflow-hidden pl-10 pr-8 text-sm leading-7 text-zinc-500">{faq.answer}</p></div></motion.div>)}</div></div></motion.section>
      </main>

      <motion.footer initial={prefersReducedMotion ? false : 'hidden'} whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={revealVariants} transition={{ duration: 0.8, ease: revealEase }} className="mx-auto max-w-7xl px-5 pb-8 pt-24 lg:px-8"><div className="border-b border-zinc-800 pb-24"><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-blue-500">Have a story in mind?</p><h2 className="mt-5 max-w-3xl text-5xl font-bold tracking-[-0.08em] sm:text-7xl">Let&apos;s make it<br /><span className="text-blue-500">impossible to ignore.</span></h2><button onClick={() => setIsContactOpen(true)} className="mt-9 inline-flex items-center gap-6 bg-blue-600 px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.17em] transition hover:bg-blue-500">Start a conversation <ArrowUpRight size={16} /></button></div><div className="flex flex-col justify-between gap-7 py-7 text-xs text-zinc-500 md:flex-row md:items-center"><a href="#top" className="text-xl font-bold tracking-[-0.08em] text-zinc-100">DOTIN<span className="text-blue-500">.</span></a><div className="flex flex-wrap gap-5 uppercase tracking-[0.12em]"><a className="flex items-center gap-2 hover:text-white" href="mailto:hello@dotin.studio"><Mail size={14} />hello@dotin.studio</a><a className="flex items-center gap-2 hover:text-white" href="https://instagram.com/" target="_blank" rel="noreferrer"><Camera size={14} />Instagram</a><a className="flex items-center gap-2 hover:text-white" href="https://wa.me/919876543210" target="_blank" rel="noreferrer"><MessageCircle size={14} />WhatsApp</a></div><span className="font-mono text-[10px] uppercase tracking-wider">© {new Date().getFullYear()} DOTIN STUDIO</span></div></motion.footer>

      <AnimatePresence>{activeModalItem && <motion.div initial={prefersReducedMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={prefersReducedMotion ? undefined : { opacity: 0 }} transition={{ duration: 0.2 }} className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-4 backdrop-blur-md sm:p-6" onClick={() => setActiveModalItem(null)}><motion.section initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.97, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.98, y: 8 }} transition={{ duration: 0.35, ease: revealEase }} className="max-h-[calc(100dvh-2rem)] min-h-0 w-full max-w-5xl overflow-y-auto border border-zinc-700 bg-zinc-900 shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="storyboard-title" onClick={(event) => event.stopPropagation()}><div className="flex items-center justify-between bg-blue-600 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.15em]"><span>Storyboard / {activeModalItem.categoryLabel}</span><button onClick={() => setActiveModalItem(null)} aria-label="Close storyboard"><X size={17} /></button></div><div className="p-5 sm:p-8"><div className="flex flex-col justify-between gap-4 border-b border-zinc-700 pb-7 sm:flex-row sm:items-end"><div><p className="font-mono text-[10px] uppercase tracking-[0.18em] text-blue-500">Concept file / {activeModalItem.id}</p><h2 id="storyboard-title" className="mt-3 text-3xl font-bold tracking-[-0.06em] sm:text-5xl">{activeModalItem.title}</h2></div><span className="font-mono text-xs text-zinc-500">{activeModalItem.format}</span></div><div className="grid gap-5 border-b border-zinc-700 py-6 text-sm sm:grid-cols-[1.7fr_1fr]"><div><span className="font-mono text-[9px] uppercase tracking-[0.15em] text-blue-500">Concept objective</span><p className="mt-2 max-w-2xl leading-6 text-zinc-400">{activeModalItem.objective}</p></div><div><span className="font-mono text-[9px] uppercase tracking-[0.15em] text-blue-500">Tone</span><p className="mt-2 leading-6 text-zinc-400">Precise, tactile, quietly magnetic.</p></div></div><div className="grid gap-3 py-7 sm:grid-cols-2 lg:grid-cols-4">{getFrames(activeModalItem).map((frame) => <div className="bg-zinc-950" key={frame.frame}><img src={frame.image} alt="" className="aspect-[4/3] w-full object-cover saturate-[.7]" /><div className="p-3"><span className="font-mono text-[9px] uppercase tracking-wider text-blue-500">{frame.frame}</span><p className="mt-2 text-xs leading-5 text-zinc-400">{frame.detail}</p></div></div>)}</div><div className="flex flex-wrap gap-3"><button onClick={() => { setActiveModalItem(null); setIsContactOpen(true) }} className="inline-flex items-center gap-5 bg-blue-600 px-5 py-3.5 text-[10px] font-semibold uppercase tracking-[0.17em] transition hover:bg-blue-500">Request similar project <ArrowUpRight size={16} /></button>{getDriveIds(activeModalItem).length > 0 && <button onClick={() => { const item = activeModalItem; setActiveModalItem(null); playDriveFilm(item, 0) }} className="inline-flex items-center gap-3 border border-zinc-700 px-5 py-3.5 text-[10px] font-semibold uppercase tracking-[0.17em] text-zinc-300 transition hover:border-blue-500 hover:text-white">Watch the film <Play size={14} fill="currentColor" className="text-blue-500" /></button>}</div></div></motion.section></motion.div>}</AnimatePresence>

      {isContactOpen && <div className="fixed inset-0 z-[60] grid place-items-center bg-black/80 p-4 backdrop-blur-md" onClick={() => setIsContactOpen(false)}><section className="w-full max-w-lg border border-zinc-700 bg-zinc-900 p-6 shadow-2xl sm:p-8" role="dialog" aria-modal="true" aria-labelledby="contact-title" onClick={(event) => event.stopPropagation()}><div className="flex items-start justify-between"><div><p className="font-mono text-[10px] uppercase tracking-[0.18em] text-blue-500">Start something / 006</p><h2 id="contact-title" className="mt-3 text-3xl font-bold tracking-[-0.06em]">Tell us the brief.</h2></div><button onClick={() => setIsContactOpen(false)} aria-label="Close contact modal" className="text-zinc-500 hover:text-white"><X size={20} /></button></div><p className="mt-4 text-sm leading-6 text-zinc-400">Send a note and we&apos;ll get back to you within one working day.</p><div className="mt-7 grid gap-3"><a className="flex items-center justify-between border border-zinc-700 px-4 py-4 text-xs uppercase tracking-[0.13em] transition hover:border-blue-500" href="mailto:hello@dotin.studio">Email hello@dotin.studio <Mail size={16} className="text-blue-500" /></a><a className="flex items-center justify-between border border-zinc-700 px-4 py-4 text-xs uppercase tracking-[0.13em] transition hover:border-blue-500" href="https://wa.me/919876543210" target="_blank" rel="noreferrer">Message on WhatsApp <MessageCircle size={16} className="text-blue-500" /></a></div><p className="mt-6 flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-zinc-600"><Clock3 size={13} /> Response time: within 1 business day</p></section></div>}
      <AnimatePresence>
        {activeDriveItem && (() => {
          const activeDriveIds = getDriveIds(activeDriveItem)
          const activeDriveId = activeDriveIds[activeDriveIndex] ?? activeDriveIds[0]
          return (
          <motion.div className="fixed inset-0 z-[55] grid place-items-center bg-black/80 p-4 backdrop-blur-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeDrivePreview}>
            <motion.section className="relative max-h-[calc(100dvh-2rem)] w-full max-w-5xl overflow-y-auto border border-zinc-700 bg-zinc-900 p-5 shadow-2xl sm:p-8" role="dialog" aria-modal="true" aria-labelledby="drive-preview-title" initial={{ opacity: 0, scale: 0.97, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, y: 8 }} onClick={(event) => event.stopPropagation()}>
              <button onClick={closeDrivePreview} className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center border border-white/15 bg-zinc-950/80 text-zinc-300" aria-label="Close Drive preview"><X size={17} /></button>
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-blue-500">Google Drive preview / {activeDriveItem.categoryLabel}</p>
              <h2 id="drive-preview-title" className="mt-3 pr-12 text-3xl font-bold uppercase tracking-[-0.06em]">{activeDriveItem.title}</h2>
              <div className="relative mt-6 h-[55vh] min-h-[280px] overflow-hidden border border-zinc-700 bg-black">
                {isDriveLoading && <div className="absolute inset-0 z-10 grid place-items-center bg-zinc-950 font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">Loading preview...</div>}
                <iframe key={activeDriveId} className="relative z-0 h-full w-full border-0" src={`https://drive.google.com/file/d/${activeDriveId}/preview`} title={`${activeDriveItem.title} preview`} allow="autoplay; fullscreen; encrypted-media; picture-in-picture" allowFullScreen referrerPolicy="no-referrer" onLoad={() => setIsDriveLoading(false)} />
              </div>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                {activeDriveIds.length > 1 ? (
                  <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Select film">
                    {activeDriveIds.map((id, index) => (
                      <button
                        key={id}
                        onClick={() => { if (index !== activeDriveIndex) playDriveFilm(activeDriveItem, index) }}
                        aria-pressed={index === activeDriveIndex}
                        className={`border px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] transition ${index === activeDriveIndex ? 'border-blue-500 bg-blue-600/15 text-blue-400' : 'border-zinc-800 bg-zinc-900 text-zinc-500 hover:border-zinc-600 hover:text-zinc-200'}`}
                      >
                        Film {String(index + 1).padStart(2, '0')}
                      </button>
                    ))}
                  </div>
                ) : <span />}
                <a href={`https://drive.google.com/file/d/${activeDriveId}/view`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 border border-zinc-800 px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500 transition hover:border-zinc-600 hover:text-zinc-300">Open in Google Drive <ArrowUpRight size={15} /></a>
              </div>
            </motion.section>
          </motion.div>
          )
        })()}
      </AnimatePresence>
    </div>
  )
}

export default App

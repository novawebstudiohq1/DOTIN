import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  Check,
  Clapperboard,
  ExternalLink,
  MessageCircle,
  X,
} from 'lucide-react'

const DEFAULT_POSTER = 'https://images.unsplash.com/photo-1531058020387-3be344556be6?q=85&w=1200&auto=format&fit=crop'
const DEFAULT_DRIVE_FILE_ID = 'PASTE_GOOGLE_DRIVE_FILE_ID_HERE'
const DEFAULT_WHATSAPP_NUMBER = '919876543210'
const easing = [0.22, 1, 0.36, 1]

const defaultDeliverables = [
  'Concept direction and shot list',
  'One polished hero film',
  'Social-ready cutdowns',
  'Two focused revision rounds',
]

function ConceptCard({
  item,
  brandName = 'DOT IN MEDIA',
  category,
  title,
  price = 'SPEC CONCEPT',
  poster,
  driveFileId,
  objective,
  deliverables = defaultDeliverables,
  whatsappNumber = DEFAULT_WHATSAPP_NUMBER,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isFrameLoading, setIsFrameLoading] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  const project = item ?? {}
  const projectTitle = title ?? project.title ?? 'Untitled concept'
  const projectCategory = category ?? project.categoryLabel ?? project.category ?? 'Concept'
  const projectPoster = poster ?? project.thumbnail ?? DEFAULT_POSTER
  const projectObjective = objective ?? project.objective ?? 'A considered visual direction built to give your next campaign a sharper point of view.'
  const projectDeliverables = deliverables.length > 0 ? deliverables : defaultDeliverables
  const projectDriveFileId = driveFileId ?? project.driveFileId ?? DEFAULT_DRIVE_FILE_ID
  const drivePreviewUrl = `https://drive.google.com/file/d/${projectDriveFileId}/preview`
  const inquiryUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hi DOT IN MEDIA, I would like to discuss a project similar to ${projectTitle}.`)}`

  const openModal = () => {
    setIsFrameLoading(true)
    setIsModalOpen(true)
  }

  useEffect(() => {
    if (!isModalOpen) return undefined

    const closeWithEscape = (event) => {
      if (event.key === 'Escape') setIsModalOpen(false)
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', closeWithEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', closeWithEscape)
    }
  }, [isModalOpen])

  const handleCardKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      openModal()
    }
  }

  return (
    <>
      <motion.article
        className="group relative isolate overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl shadow-black/10 transition-colors duration-300 hover:border-accent/50"
        initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
        whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.65, ease: easing }}
        whileHover={prefersReducedMotion ? undefined : { scale: 1.03, y: -6 }}
      >
        <button
          type="button"
          className="relative block aspect-[4/3] w-full cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset"
          onClick={openModal}
          onKeyDown={handleCardKeyDown}
          aria-label={`Open ${projectTitle} concept details`}
        >
          <img
            src={projectPoster}
            alt={`${projectTitle} poster`}
            className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-bg/75 via-transparent to-bg/95" />
          <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-4 p-4 sm:p-5">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-bg/70 px-3 py-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-white backdrop-blur-md">
              <Clapperboard size={12} className="text-accent-highlight" />
              {brandName}
            </span>
            <span className="rounded-full border border-accent-highlight/30 bg-accent/15 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-accent-pale backdrop-blur-md">
              {projectCategory}
            </span>
          </div>
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4 sm:p-5">
            <div>
              <span className="mb-2 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-muted2">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                View concept
              </span>
              <h2 className="max-w-[18rem] text-lg font-semibold uppercase leading-tight tracking-[-0.03em] text-white sm:text-xl">
                {projectTitle}
              </h2>
            </div>
            <span className="shrink-0 rounded-lg border border-white/15 bg-bg/75 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.12em] text-fg2 backdrop-blur-md">
              {price}
            </span>
          </div>
        </button>
      </motion.article>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-4 backdrop-blur-md sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsModalOpen(false)}
          >
            <motion.section
              className="relative grid max-h-[calc(100dvh-2rem)] min-h-0 w-full max-w-6xl overflow-y-auto rounded-2xl border border-line2 bg-surface shadow-2xl shadow-black/50 lg:grid-cols-[minmax(0,1.5fr)_minmax(280px,.65fr)]"
              role="dialog"
              aria-modal="true"
              aria-labelledby={`${project.id ?? projectTitle}-title`}
              initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.98, y: 8 }}
              transition={{ duration: 0.35, ease: easing }}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full border border-line bg-bg/75 text-fg2 backdrop-blur-md transition hover:border-accent/60 hover:text-fg focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                aria-label="Close concept details"
              >
                <X size={17} />
              </button>
              <div className="relative min-h-[280px] bg-black lg:min-h-full">
                {isFrameLoading && <div className="absolute inset-0 z-10 grid place-items-center bg-bg text-[10px] uppercase tracking-[0.16em] text-muted2">Loading preview...</div>}
                <iframe
                  className="relative z-0 h-[42vh] min-h-[220px] w-full border-0 sm:min-h-[280px] lg:h-full lg:min-h-[620px]"
                  src={drivePreviewUrl}
                  title={`${projectTitle} Google Drive preview`}
                  width="100%"
                  height="100%"
                  allow="autoplay; fullscreen"
                  allowFullScreen
                  onLoad={() => setIsFrameLoading(false)}
                />
              </div>
              <aside className="flex flex-col p-6 sm:p-8">
                <div>
                  <div className="flex items-center justify-between gap-4 font-mono text-[9px] uppercase tracking-[0.16em] text-accent-highlight">
                    <span>{brandName}</span>
                    <span>{projectCategory}</span>
                  </div>
                  <h2 id={`${project.id ?? projectTitle}-title`} className="mt-5 text-3xl font-bold uppercase leading-none tracking-[-0.06em] text-fg sm:text-4xl">
                    {projectTitle}
                  </h2>
                  <p className="mt-7 text-sm leading-7 text-muted2">{projectObjective}</p>
                </div>
                <div className="mt-8 border-t border-line pt-6">
                  <h3 className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">Deliverables</h3>
                  <ul className="mt-4 space-y-3">
                    {projectDeliverables.map((deliverable) => (
                      <li className="flex items-start gap-3 text-sm text-fg2" key={deliverable}>
                        <Check size={15} className="mt-0.5 shrink-0 text-accent" />
                        <span>{deliverable}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <a
                  className="mt-9 inline-flex items-center justify-center gap-3 rounded-xl bg-accent px-4 py-3.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-accent-ink transition hover:bg-accent-highlight"
                  href={inquiryUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <MessageCircle size={16} />
                  Inquire on WhatsApp
                  <ExternalLink size={14} />
                </a>
              </aside>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default ConceptCard

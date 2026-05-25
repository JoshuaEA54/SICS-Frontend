import { useEffect, useRef } from 'react'
import { renderAsync } from 'docx-preview'

interface DocxPreviewFrameProps {
  blob: Blob
}

export function DocxPreviewFrame({ blob }: DocxPreviewFrameProps) {
  const bodyRef = useRef<HTMLDivElement>(null)
  const styleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const bodyEl = bodyRef.current
    const styleEl = styleRef.current
    if (!bodyEl) return

    bodyEl.innerHTML = ''
    if (styleEl) styleEl.innerHTML = ''

    let cancelled = false

    renderAsync(blob, bodyEl, styleEl ?? undefined, {
      className: 'docx-preview',
      inWrapper: true,
      ignoreWidth: false,
      ignoreHeight: false,
    }).catch(() => {
      if (!cancelled && bodyEl) {
        bodyEl.innerHTML =
          '<p style="color:#6b6b80;font-size:14px">No se pudo renderizar el documento. Descárguelo para verlo.</p>'
      }
    })

    return () => {
      cancelled = true
      bodyEl.innerHTML = ''
      if (styleEl) styleEl.innerHTML = ''
    }
  }, [blob])

  return (
    <div className="docx-preview-wrapper overflow-x-auto">
      <div ref={styleRef} aria-hidden="true" />
      <div ref={bodyRef} />
    </div>
  )
}

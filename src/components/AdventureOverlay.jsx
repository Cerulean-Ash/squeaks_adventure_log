import { useState } from 'react'
import { fireConfetti, notifyAshley } from '../utils'

export default function AdventureOverlay({ adventure, onClose }) {
  const [step,   setStep]   = useState('question') // 'question' | 'custom' | 'date' | 'done' | 'maybe'
  const [custom, setCustom] = useState('')
  const [date,   setDate]   = useState('')

  // The actual adventure name — either the preset or what she typed
  const name = adventure.custom && custom.trim() ? custom.trim() : adventure.name

  function handleConfirm() {
    setStep('done')
    fireConfetti()
    notifyAshley({ ...adventure, name }, date || null)
  }

  return (
    <div className="overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="overlay-box" role="dialog" aria-modal="true">
        <div className="ov-icon">{adventure.icon}</div>

        {step === 'question' && <>
          <p className="ov-q">Julia — want to do <strong>{adventure.name}</strong> next?</p>
          <div className="ov-btns">
            <button className="btn btn-yes" onClick={() => setStep(adventure.custom ? 'custom' : 'date')}>Yes! 🎉</button>
            <button className="btn btn-no"  onClick={() => setStep('maybe')}>Let me think...</button>
          </div>
        </>}

        {step === 'custom' && <>
          <p className="ov-q">What's the adventure, Squeaks?</p>
          <input
            type="text"
            className="date-input"
            placeholder="e.g. Pottery class..."
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            autoFocus
          />
          <div className="ov-btns">
            <button className="btn btn-yes" onClick={() => setStep('date')} disabled={!custom.trim()}>Next →</button>
          </div>
        </>}

        {step === 'date' && <>
          <p className="ov-q">When's good, Squeaks?</p>
          <div className="date-wrapper">
            <div className="date-display">
              {date
                ? new Date(date + 'T12:00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })
                : '📅 Tap to pick a date'}
            </div>
            <input
              type="date"
              className="date-input-hidden"
              value={date}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setDate(e.target.value)}
              onClick={(e) => e.target.showPicker?.()}
            />
          </div>
          <div className="ov-btns">
            <button className="btn btn-yes" onClick={handleConfirm}>Let's go! 🎉</button>
          </div>
        </>}

        {step === 'done'  && <p className="ov-result">Excellent choice. Ashley has been notified 📱 Byebye 😘😘</p>}
        {step === 'maybe' && <p className="ov-result">Squeaks. The answer is yes. 😏</p>}

        <button className="ov-close" onClick={onClose}>← back</button>
      </div>
    </div>
  )
}

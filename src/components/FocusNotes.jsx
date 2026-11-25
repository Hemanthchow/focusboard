import { useState } from 'react';
import { CalendarCheck, CheckCheck, ChevronLeft, ChevronRight, Timer } from 'lucide-react';

// Replace the copy below with the exact text from the Figma Focus Notes frames.
const SLIDES = [
  {
    id: 'plan',
    title: 'Plan your day',
    body: 'Pick the three tasks that matter most and give each one a due date before you open anything else.',
    tone: 'teal',
    icon: CalendarCheck,
  },
  {
    id: 'deep-work',
    title: 'Protect one block of deep work',
    body: 'Set aside a single 90 minute window with notifications off, and put the task you keep avoiding inside it.',
    tone: 'amber',
    icon: Timer,
  },
  {
    id: 'close-loop',
    title: 'Close the loop',
    body: 'Before you stop, mark finished work as completed and note what comes next, so tomorrow starts without guessing.',
    tone: 'navy',
    icon: CheckCheck,
  },
];

export default function FocusNotes() {
  const [index, setIndex] = useState(0);
  const count = SLIDES.length;
  const slide = SLIDES[index];
  const Art = slide.icon;

  // Wraps around: Next on the last slide goes to the first, and the reverse.
  const goTo = (target) => setIndex((target + count) % count);

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowLeft') goTo(index - 1);
    if (event.key === 'ArrowRight') goTo(index + 1);
  };

  return (
    <section
      id="focus-notes"
      className={`notes notes--${slide.tone}`}
      aria-roledescription="carousel"
      aria-label="Focus Notes"
      onKeyDown={handleKeyDown}
    >
      <p className="notes__count">
        Focus Notes · {index + 1} of {count}
      </p>

      <div
        className="notes__slide"
        role="group"
        aria-roledescription="slide"
        aria-label={`${index + 1} of ${count}`}
        aria-live="polite"
      >
        <h2>{slide.title}</h2>
        <p>{slide.body}</p>
      </div>

      <Art className="notes__art" size={120} strokeWidth={1.5} aria-hidden="true" />

      <div className="notes__controls">
        <div className="notes__btns">
          <button type="button" className="notes__btn" onClick={() => goTo(index - 1)}>
            <ChevronLeft size={18} aria-hidden="true" />
            Previous
          </button>
          <button type="button" className="notes__btn" onClick={() => goTo(index + 1)}>
            Next
            <ChevronRight size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="notes__dots" role="group" aria-label="Choose a note">
          {SLIDES.map((item, i) => (
            <button
              key={item.id}
              type="button"
              className="dot"
              onClick={() => goTo(i)}
              aria-label={`Go to note ${i + 1}: ${item.title}`}
              aria-current={i === index ? 'true' : undefined}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { Quote, Star } from "lucide-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

const testimonials = [
  {
    name: "Nome do cliente",
    comment: "Adicione aqui o comentário publicado pelo cliente no Google.",
    rating: 1,
  },
  {
    name: "Nome do cliente",
    comment: "Adicione aqui o comentário publicado pelo cliente no Google.",
    rating: 2,
  },
  {
    name: "Nome do cliente",
    comment: "Adicione aqui o comentário publicado pelo cliente no Google.",
    rating: 3,
  },
  {
    name: "Nome do cliente",
    comment: "Adicione aqui o comentário publicado pelo cliente no Google.",
    rating: 4,
  },
  {
    name: "Nome do cliente",
    comment: "Adicione aqui o comentário publicado pelo cliente no Google.",
    rating: 5,
  },
];

export function Testimonials() {
  const carouselRef = useRef<HTMLDivElement>(null);

  function scrollTestimonials(direction: "previous" | "next") {
    const carousel = carouselRef.current;

    if (!carousel) return;

    carousel.scrollBy({
      left: direction === "next" ? carousel.clientWidth : -carousel.clientWidth,
      behavior: "smooth",
    });
  }

  return (
    <section className="bg-[#f3f8fa] py-[110px] max-[620px]:py-[78px]" id="depoimentos">
      <div className="mx-auto w-[min(1120px,calc(100%-40px))] max-[620px]:w-[min(1120px,calc(100%-28px))]">
        <div className="mx-auto mb-[42px] max-w-[700px] text-center">
          <h2 className="my-3 text-[clamp(2.2rem,4vw,3.7rem)] font-bold leading-[1.05]">
            O que nossos clientes dizem
          </h2>
          <p className="leading-[1.7] text-muted">
            Experiências compartilhadas por quem já viajou com a GLM Transporte e Turismo.
          </p>
        </div>

        <div className="mb-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => scrollTestimonials("previous")}
            className="grid h-11 w-11 place-items-center rounded-full border border-[#c9dde3] bg-white text-green transition hover:-translate-y-0.5 hover:border-green-light hover:text-green-light"
            aria-label="Ver depoimentos anteriores"
          >
            <ChevronLeft size={21} />
          </button>
          <button
            type="button"
            onClick={() => scrollTestimonials("next")}
            className="grid h-11 w-11 place-items-center rounded-full bg-green text-white transition hover:-translate-y-0.5 hover:bg-green-light"
            aria-label="Ver próximos depoimentos"
          >
            <ChevronRight size={21} />
          </button>
        </div>

        <div
          ref={carouselRef}
          className="grid snap-x snap-mandatory auto-cols-[calc((100%-48px)/3)] grid-flow-col gap-6 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden max-[900px]:auto-cols-[calc((100%-24px)/2)] max-[620px]:auto-cols-[100%]"
        >
          {testimonials.map((testimonial, index) => (
            <article
              className="flex min-h-[285px] snap-start flex-col rounded-[22px] border border-[#d7e7eb] bg-white p-7 shadow-[0_14px_45px_rgba(44,109,144,.07)]"
              key={`${testimonial.name}-${index}`}
            >
              <div className="mb-6 flex items-start justify-between gap-4">
                <div className="flex gap-1 text-peach" aria-label={`${testimonial.rating} de 5 estrelas`}>
                  {Array.from({ length: testimonial.rating }).map((_, starIndex) => (
                    <Star key={starIndex} size={18} fill="currentColor" aria-hidden="true" />
                  ))}
                </div>
                <Quote className="text-green-light/25" size={34} aria-hidden="true" />
              </div>

              <blockquote className="flex-1 leading-[1.7] text-muted">
                “{testimonial.comment}”
              </blockquote>

              <div className="mt-6 border-t border-[#e2edf0] pt-5">
                <strong className="block text-ink">{testimonial.name}</strong>
                <span className="mt-1 block text-sm text-muted">Avaliação no Google</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

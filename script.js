(() => {
  const WHATSAPP_LINK = "https://wa.me/5591993128763?text=Olá,%20gostaria%20de%20saber%20mais%20sobre%20reservas";

  const setImagePerformanceAttributes = () => {
    const allImages = document.querySelectorAll("img");
    allImages.forEach((img, index) => {
      if (!img.hasAttribute("decoding")) {
        img.setAttribute("decoding", "async");
      }
      if (!img.hasAttribute("loading")) {
        const isAboveTheFold = index < 4 || img.closest(".hero");
        img.setAttribute("loading", isAboveTheFold ? "eager" : "lazy");
      }
    });
  };

  const applyWhatsappLinks = () => {
    const targets = document.querySelectorAll(".btn--hero, .btn--cta");
    targets.forEach((anchor) => {
      anchor.setAttribute("href", WHATSAPP_LINK);
      anchor.setAttribute("target", "_blank");
      anchor.setAttribute("rel", "noopener noreferrer");
    });
  };

  const initCarousel = (root) => {
    const slides = Array.from(root.querySelectorAll("[data-slide]"));
    if (!slides.length) {
      return;
    }

    const controlsScope = root.classList.contains("service-carousel") ? root.parentElement : root;
    const prevBtn = controlsScope.querySelector("[data-carousel-prev]");
    const nextBtn = controlsScope.querySelector("[data-carousel-next]");
    const dotsContainer = controlsScope.querySelector("[data-carousel-dots]");

    let current = 0;
    let timer = null;
    const isHeroCarousel = root.classList.contains("hero__carousel");
    const heroLabelMap = {
      "foto-principal-primeiradocarrossel-da-hero.webp": "Marina Pier Maguari",
      "IMG_0233.JPG.webp": "Entrada",
      "IMG_0234.JPG.webp": "Estacionamento Próprio",
      "IMG_0609 - Capa.webp": "Hospedagem Standard",
      "IMG_0240.JPG.webp": "Descida de embarcações",
      "IMG_0267.JPG.webp": "Passeio de Pônei",
      "IMG_0271.JPG.webp": "Fazendinha",
      "IMG_0292.JPG.webp": "Marina Pier Maguari",
      "foto-guarda-de-embarcacoes.webp": "Guarda de Embarcações",
      "IMG_0275-capa.webp": "Fazendinha",
      "IMG_0274.webp": "Fazendinha",
      "IMG_0277.webp": "Fazendinha",
      "IMG_0279.webp": "Fazendinha",
      "IMG_0280.webp": "Fazendinha",
      "IMG_1748.JPG.webp": "Descida de embarcações",
      "IMG_4992.JPG.webp": "Aluguel de espaço para eventos privados",
      "IMG_4994.JPG.webp": "Aluguel de churrasqueira",
      "IMG_5001.JPG.webp": "Aluguel de espaço para eventos privados",
      "IMG_5012.JPG.webp": "Marina Pier Maguari",
      "IMG_5015.JPG.webp": "Aluguel de espaço para eventos privados",
      "IMG_5019.JPG.webp": "Aluguel de churrasqueira",
      "IMG_5075.JPG.webp": "Aluguel de espaço para eventos privados",
      "IMG_0569.webp": "Venda e aluguel de embarcações",
      "IMG_1115-capa.webp": "Restaurante",
      "IMG_5102.JPG.webp": "Aluguel de espaço para eventos privados",
      "IMG_5103.JPG.webp": "Aluguel de espaço para eventos privados",
      "aluguel-de-flutuante.webp": "Aluguel de flutuante",
      "IMG_0516 - capa.webp": "Hospedagem Premium"
    };

    let heroLabel = null;

    const getHeroLabel = (slide) => {
      const customLabel = slide.dataset.heroLabel;
      if (customLabel) {
        return customLabel;
      }
      const src = slide.getAttribute("src") || "";
      const fileName = src.split("/").pop() || "";
      return heroLabelMap[fileName] || "Marina Pier Maguari";
    };

    const updateHeroLabel = (slide) => {
      if (!heroLabel || !slide) {
        return;
      }
      const text = getHeroLabel(slide);
      heroLabel.classList.remove("is-visible");
      window.setTimeout(() => {
        heroLabel.textContent = text;
        heroLabel.classList.add("is-visible");
      }, 90);
    };

    if (isHeroCarousel) {
      heroLabel = root.querySelector(".hero__slide-label");
      if (!heroLabel) {
        heroLabel = document.createElement("div");
        heroLabel.className = "hero__slide-label";
        root.appendChild(heroLabel);
      }
    }

    const setActive = (index) => {
      current = (index + slides.length) % slides.length;
      slides.forEach((slide, i) => {
        slide.classList.toggle("is-active", i === current);
      });

      if (dotsContainer) {
        Array.from(dotsContainer.children).forEach((dot, i) => {
          dot.classList.toggle("is-active", i === current);
        });
      }

      if (isHeroCarousel) {
        updateHeroLabel(slides[current]);
      }
    };

    if (slides.length > 1 && dotsContainer) {
      slides.forEach((_, i) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.setAttribute("aria-label", `Ir para imagem ${i + 1}`);
        dot.addEventListener("click", () => {
          setActive(i);
          restartAuto();
        });
        dotsContainer.appendChild(dot);
      });
    }

    const next = () => setActive(current + 1);
    const prev = () => setActive(current - 1);

    if (slides.length <= 1) {
      if (prevBtn) prevBtn.style.display = "none";
      if (nextBtn) nextBtn.style.display = "none";
      if (dotsContainer) dotsContainer.style.display = "none";
      setActive(0);
      return;
    }

    if (prevBtn) prevBtn.addEventListener("click", () => {
      prev();
      restartAuto();
    });

    if (nextBtn) nextBtn.addEventListener("click", () => {
      next();
      restartAuto();
    });

    const auto = root.dataset.carouselAuto === "true" || root.classList.contains("hero__carousel");

    const stopAuto = () => {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    };

    const startAuto = () => {
      if (!auto) {
        return;
      }
      stopAuto();
      timer = window.setInterval(next, 4500);
    };

    const restartAuto = () => {
      stopAuto();
      startAuto();
    };

    controlsScope.addEventListener("mouseenter", stopAuto);
    controlsScope.addEventListener("mouseleave", startAuto);

    setActive(0);
    startAuto();
  };

  const initRevealAnimations = () => {
    const revealTargets = document.querySelectorAll(
      ".hero__left, .hero__carousel, .value-proposition, .differentials .shell, .services h2, .services__divider, .service-card, .testimonials h2, .testimonials__score, .testimonials__based, .review, .google-powered, .cta__content, .footer__top, .footer__center, .footer__copyright"
    );

    revealTargets.forEach((element) => {
      element.setAttribute("data-reveal", "");
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    revealTargets.forEach((element) => observer.observe(element));
  };

  const initServiceLightbox = () => {
    const mediaBlocks = Array.from(document.querySelectorAll(".service-card .service-card__media"));
    if (!mediaBlocks.length) {
      return;
    }

    const lightbox = document.createElement("div");
    lightbox.className = "lightbox";
    lightbox.innerHTML = `
      <div class="lightbox__content" role="dialog" aria-modal="true" aria-label="Visualizador de imagem">
        <button type="button" class="lightbox__close" aria-label="Fechar imagem">&times;</button>
        <button type="button" class="lightbox__nav lightbox__nav--prev" aria-label="Imagem anterior">&#8249;</button>
        <img class="lightbox__image" alt="" />
        <button type="button" class="lightbox__nav lightbox__nav--next" aria-label="Próxima imagem">&#8250;</button>
      </div>
    `;
    document.body.appendChild(lightbox);

    const lightboxImage = lightbox.querySelector(".lightbox__image");
    const closeBtn = lightbox.querySelector(".lightbox__close");
    const prevBtn = lightbox.querySelector(".lightbox__nav--prev");
    const nextBtn = lightbox.querySelector(".lightbox__nav--next");
    const content = lightbox.querySelector(".lightbox__content");

    let activeImages = [];
    let activeIndex = 0;

    const updateImage = () => {
      if (!activeImages.length) {
        return;
      }
      const src = activeImages[activeIndex].getAttribute("src");
      const alt = activeImages[activeIndex].getAttribute("alt") || "Imagem do serviço";
      lightboxImage.setAttribute("src", src || "");
      lightboxImage.setAttribute("alt", alt);
      const showNav = activeImages.length > 1;
      prevBtn.style.display = showNav ? "inline-flex" : "none";
      nextBtn.style.display = showNav ? "inline-flex" : "none";
    };

    const openLightbox = (images, startIndex) => {
      activeImages = images;
      activeIndex = startIndex;
      updateImage();
      lightbox.classList.add("is-open");
      document.body.style.overflow = "hidden";
    };

    const closeLightbox = () => {
      lightbox.classList.remove("is-open");
      document.body.style.overflow = "";
    };

    const goPrev = () => {
      if (!activeImages.length) return;
      activeIndex = (activeIndex - 1 + activeImages.length) % activeImages.length;
      updateImage();
    };

    const goNext = () => {
      if (!activeImages.length) return;
      activeIndex = (activeIndex + 1) % activeImages.length;
      updateImage();
    };

    mediaBlocks.forEach((media) => {
      const carouselSlides = Array.from(media.querySelectorAll(".service-carousel [data-slide]"));
      const directImage = media.querySelector(":scope > img");
      const images = carouselSlides.length ? carouselSlides : directImage ? [directImage] : [];
      if (!images.length) {
        return;
      }

      media.addEventListener("click", () => {
        let startIndex = images.findIndex((img) => img.classList.contains("is-active"));
        if (startIndex < 0) {
          startIndex = 0;
        }
        openLightbox(images, startIndex);
      });

      media.querySelectorAll("[data-carousel-prev], [data-carousel-next], [data-carousel-dots] button").forEach((control) => {
        control.addEventListener("click", (event) => {
          event.stopPropagation();
        });
      });
    });

    closeBtn.addEventListener("click", closeLightbox);
    prevBtn.addEventListener("click", goPrev);
    nextBtn.addEventListener("click", goNext);

    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) {
        closeLightbox();
      }
    });

    content.addEventListener("click", (event) => {
      event.stopPropagation();
    });

    document.addEventListener("keydown", (event) => {
      if (!lightbox.classList.contains("is-open")) {
        return;
      }
      if (event.key === "Escape") {
        closeLightbox();
      } else if (event.key === "ArrowLeft") {
        goPrev();
      } else if (event.key === "ArrowRight") {
        goNext();
      }
    });
  };

  const initLazyReviewsWidget = () => {
    const widget = document.querySelector(".elfsight-app-758cd1f8-e41e-42bc-bd75-128aa29aca0d");
    if (!widget) {
      return;
    }

    let loaded = false;
    const loadScript = () => {
      if (loaded) return;
      loaded = true;
      const script = document.createElement("script");
      script.src = "https://elfsightcdn.com/platform.js";
      script.async = true;
      document.body.appendChild(script);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            loadScript();
            observer.disconnect();
          }
        });
      },
      { rootMargin: "200px 0px" }
    );

    observer.observe(widget);
  };

  const init = () => {
    setImagePerformanceAttributes();
    applyWhatsappLinks();
    document.querySelectorAll("[data-carousel]").forEach(initCarousel);
    initServiceLightbox();
    initLazyReviewsWidget();
    initRevealAnimations();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

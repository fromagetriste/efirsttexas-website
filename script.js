console.log("script.js loaded");
let hasRunScripts = false;
function runScripts() {
  if (hasRunScripts) {
    console.log("runScripts already executed, skipping.");
    return;
  }
  hasRunScripts = true;
  // Configuration that can be customized
  const CONFIG = {
    animations: {
      numberDuration: 2000,
      easing: "easeOutQuad",
      threshold: 0.1,
    },
    images: {
      quality: 0.9,
      bufferMultiplier: 1.5,
      useWebWorker: true,
      fallbackWidth: 1200,
    },
    observers: {
      rootMargin: "0px",
      threshold: 0.1,
    },
  };
  // Collection of easing functions
  const EASINGS = {
    linear: (t, b, c, d) => (c * t) / d + b,
    easeOutQuad: (t, b, c, d) => {
      t /= d;
      return -c * t * (t - 2) + b;
    },
    easeInOutQuad: (t, b, c, d) => {
      t /= d / 2;
      if (t < 1) return (c / 2) * t * t + b;
      t--;
      return (-c / 2) * (t * (t - 2) - 1) + b;
    },
  };
  // Store all observers to properly disconnect them later
  const observerRegistry = {
    instances: {},
    register: function (name, observer) {
      this.instances[name] = observer;
      return observer;
    },
    disconnectAll: function () {
      Object.values(this.instances).forEach((observer) => {
        if (observer && typeof observer.disconnect === "function") {
          observer.disconnect();
        }
      });
      this.instances = {};
    },
  };
  // Feature detection for critical functionality
  const featureSupport = {
    intersectionObserver: "IntersectionObserver" in window,
    mutationObserver: "MutationObserver" in window,
    canvas: (() => {
      const canvas = document.createElement("canvas");
      return !!(canvas.getContext && canvas.getContext("2d"));
    })(),
    webWorkers: "Worker" in window,
    webp: false, // Will be detected later

    // Check all critical features
    hasRequiredFeatures() {
      return this.intersectionObserver && this.canvas;
    },

    // Initialize feature detection that requires async operations
    detectFeatures() {
      // WebP detection
      const webpImage = new Image();
      webpImage.onload = () => {
        this.webp = true;
      };
      webpImage.onerror = () => {
        this.webp = false;
      };
      webpImage.src =
        "data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=";
    },
  };
  // Initialize feature detection
  featureSupport.detectFeatures();
  /**
   * Number animation with configurable easing
   */
  function setupNumberAnimation() {
    if (!featureSupport.intersectionObserver) {
      console.warn(
        "IntersectionObserver not supported. Number animations disabled.",
      );
      return;
    }

    // Create and register the observer
    const observer = observerRegistry.register(
      "numberAnimation",
      new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target
                .querySelectorAll('[data-target="numCount"]')
                .forEach((el) => {
                  const targetNum = parseInt(
                    el.getAttribute("data-value") || el.textContent,
                    10,
                  );
                  if (!isNaN(targetNum)) {
                    animateNumber(el, targetNum);
                  }
                });

              observer.unobserve(entry.target);
            }
          });
        },
        {
          root: null,
          rootMargin: CONFIG.observers.rootMargin,
          threshold: CONFIG.observers.threshold,
        },
      ),
    );

    function animateNumber(element, target) {
      const startValue = parseInt(element.getAttribute("data-start") || 0, 10);
      const duration = parseInt(
        element.getAttribute("data-duration") ||
          CONFIG.animations.numberDuration,
        10,
      );
      const easingName =
        element.getAttribute("data-easing") || CONFIG.animations.easing;
      const easing = EASINGS[easingName] || EASINGS.easeOutQuad;
      const formatter = element.getAttribute("data-formatter") || "none";

      let start = null;
      let current = startValue;

      // Mark as animating to prevent duplicate animations
      if (element.dataset.animating === "true") return;
      element.dataset.animating = "true";

      const step = (timestamp) => {
        if (!start) start = timestamp;
        const progress = timestamp - start;

        // Calculate current value based on easing function
        current = Math.min(
          target,
          Math.floor(
            easing(progress, startValue, target - startValue, duration),
          ),
        );

        // Apply formatter if specified
        let displayValue;
        switch (formatter) {
          case "comma":
            displayValue = current.toLocaleString();
            break;
          case "percentage":
            displayValue = current + "%";
            break;
          case "currency":
            const suffix = element.getAttribute("data-suffix") || "";
            displayValue = "$" + current.toLocaleString() + suffix;
            break;
          default:
            displayValue = current.toString();
        }

        element.textContent = displayValue;

        if (progress < duration && current < target) {
          window.requestAnimationFrame(step);
        } else {
          // Ensure final value is exact
          switch (formatter) {
            case "comma":
              element.textContent = target.toLocaleString();
              break;
            case "percentage":
              element.textContent = target + "%";
              break;
            case "currency":
              element.textContent = "$" + target.toLocaleString();
              break;
            default:
              element.textContent = target.toString();
          }

          // Mark animation as complete
          element.dataset.animating = "false";
          element.dataset.animated = "true";
        }
      };

      // Start animation in next frame
      window.requestAnimationFrame(step);
    }

    // Observe the stats section
    const statsSections = document.querySelectorAll('[data-section="stats"]');
    statsSections.forEach((section) => observer.observe(section));
  }
  function cherieYoungBranding() {
    const cmsTargets = [
      {
        selector: "footer .sierra-branding",
        text: "Sierra Interactive Custom Designs",
      },
      { selector: "footer .copyright", text: "Lofty Custom Designs" },
      {
        selector: "footer .bt-footer-nav__menu",
        text: "Boomtown Custom Designs",
      },
      { selector: "#footer .social", text: "KvCore Custom Designs" },
      {
        selector: "footer .firepoint-footer",
        text: "FirePoint Custom Designs",
      },
      {
        selector: "footer .rg-footer-branding",
        text: "Real Geeks Custom Designs",
      },
      { selector: "footer .cinc-branding", text: "CINC Custom Designs" },
      { selector: "footer .ylopo-footer", text: "Ylopo Custom Designs" },
    ];

    const linkHref = "https://www.cherieyoung.com/";
    const linkTarget = "_blank";

    const injectStyles = () => {
      const style = document.createElement("style");
      style.textContent = `
        .cherie-link {
          display: inline-block;
          position: relative;
          margin-left: 10px;
          font-size: 16px;
          padding: 4px 8px;
          color: white;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .cherie-link::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 8px;
          height: 2px;
          width: 0;
          background-color: white;
          transition: width 0.3s ease;
        }

        .cherie-link:hover::after {
          width: calc(100% - 16px);
        }
      `;
      document.head.appendChild(style);
    };

    const createLink = (text) => {
      const a = document.createElement("a");
      a.href = linkHref;
      a.target = linkTarget;
      a.textContent = text;
      a.className = "cherie-link";
      return a;
    };

    injectStyles();

    for (let cms of cmsTargets) {
      const el = document.querySelector(cms.selector);
      if (el && !el.querySelector('a[href="' + linkHref + '"]')) {
        el.appendChild(createLink(cms.text));
        console.log("Added branding link to:", cms.selector);
        break;
      }
    }
  }

  /**
   * Enhanced image optimization and lazy loading
   * - Uses web workers when available
   * - Supports WebP conversion
   * - Intelligently determines optimal image sizes
   */
  /**
   * Enhanced image optimization and lazy loading
   * - Uses web workers when available
   * - Supports WebP conversion
   * - Intelligently determines optimal image sizes
   */
  function setupLazyLoadAndFade() {
    const shouldOptimizeImages = () => window.innerWidth <= 991;
    if (!featureSupport.intersectionObserver) {
      console.warn(
        "IntersectionObserver not supported. Lazy loading disabled.",
      );
      return;
    }
    // Initialize image worker if supported
    let imageWorker;
    if (featureSupport.webWorkers && CONFIG.images.useWebWorker) {
      try {
        const workerBlob = new Blob(
          [
            `
                self.onmessage = function(e) {
                    const { imageData, width, height, quality, format } = e.data;

                    // Create canvas in worker
                    const canvas = new OffscreenCanvas(width, height);
                    const ctx = canvas.getContext('2d');

                    // Create ImageBitmap from ArrayBuffer
                    self.createImageBitmap(imageData)
                        .then(bitmap => {
                            // Draw to canvas with resize
                            ctx.drawImage(bitmap, 0, 0, width, height);

                            // Convert to requested format
                            return format === 'webp'
                                ? canvas.convertToBlob({ type: 'image/webp', quality })
                                : canvas.convertToBlob({ type: 'image/jpeg', quality });
                        })
                        .then(blob => {
                            // Read blob as dataURL
                            const reader = new FileReader();
                            reader.onloadend = function() {
                                self.postMessage({
  id: e.data.id,
  success: true,
  dataUrl: reader.result,
  width,
  height
});

                            };
                            reader.readAsDataURL(blob);
                        })
                        .catch(error => {
self.postMessage({
  id: e.data.id,
  success: false,
  error: error.message
});

                        });
                };
            `,
          ],
          { type: "application/javascript" },
        );

        imageWorker = new Worker(URL.createObjectURL(workerBlob));
      } catch (e) {
        console.warn("Web Worker creation failed:", e);
        // Fallback to main thread processing
        CONFIG.images.useWebWorker = false;
      }
    }

    // Process image using worker
    function processImageWithWorker(imgData, width, height) {
      return new Promise((resolve, reject) => {
        // Set up response handler
        const id = Math.random().toString(36).substr(2, 9);
        const messageHandler = function (e) {
          const result = e.data;
          if (result.id !== id) return; // Ignore if not matching this call
          imageWorker.removeEventListener("message", messageHandler);
          if (result.success) {
            resolve(result.dataUrl);
          } else {
            reject(new Error(result.error || "Image processing failed"));
          }
        };
        imageWorker.addEventListener("message", messageHandler);
        imageWorker.postMessage({
          id,
          imageData: imgData,
          width,
          height,
          quality: CONFIG.images.quality,
          format: featureSupport.webp ? "webp" : "jpeg",
        });
      });
    }

    // Process image on main thread (fallback)
    function processImageMainThread(img, width, height) {
      return new Promise((resolve, reject) => {
        try {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          canvas.width = width;
          canvas.height = height;

          // Draw resized image
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to appropriate format
          const format = featureSupport.webp ? "image/webp" : "image/jpeg";
          const dataUrl = canvas.toDataURL(format, CONFIG.images.quality);
          resolve(dataUrl);
        } catch (error) {
          reject(error);
        }
      });
    }

    // Downscale image with best available method
    async function downscaleImage(imgElement, photoSource, targetWidth) {
      // Add buffer for screen resizing
      const bufferedTargetWidth = Math.round(
        targetWidth * CONFIG.images.bufferMultiplier,
      );

      try {
        // Create a promise to load the image
        const imgLoaded = new Promise((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => resolve(img);
          img.onerror = (err) => {
            console.error("Image load error:", photoSource, err);
            reject(err);
          };
          // Cache-busting query to prevent reused images
          img.src = `${photoSource}?cachebust=${Date.now() + Math.random()}`;
        });
        const img = await imgLoaded;

        // Skip processing if image is already smaller than target
        if (img.width <= bufferedTargetWidth) {
          return photoSource;
        }

        // Calculate new dimensions maintaining aspect ratio
        const aspectRatio = img.height / img.width;
        const newWidth = bufferedTargetWidth;
        const newHeight = Math.round(bufferedTargetWidth * aspectRatio);

        // Process the image with worker if available
        if (CONFIG.images.useWebWorker && imageWorker) {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);

          // Get image data for worker
          const imageData = await createImageBitmap(canvas);
          return await processImageWithWorker(imageData, newWidth, newHeight);
        } else {
          // Fallback to main thread processing
          return await processImageMainThread(img, newWidth, newHeight);
        }
      } catch (error) {
        console.error("Image optimization failed:", error);
        return photoSource; // Return original on error
      }
    }

    // Setup animation end handler
    const animationEndHandler = function (event) {
      // Check if this is a fade animation element
      if (event.target.className && event.target.className.includes("fade-")) {
        // Add the helper class to force visibility after animation
        event.target.classList.add("visible-after-animation");
      }
    };

    document.addEventListener("animationend", animationEndHandler, true);

    // Function to ensure all animated elements remain visible
    function ensureElementsRemainVisible() {
      document
        .querySelectorAll('[class*="fade-"]:not([class$="-pre"])')
        .forEach(function (el) {
          el.classList.add("visible-after-animation");
        });
    }

    // Run after initial animations likely complete
    setTimeout(ensureElementsRemainVisible, 2000);

    // Create and register observers
    const observers = {
      lazy: observerRegistry.register(
        "lazyLoad",
        new IntersectionObserver(
          (entries) => {
            entries.forEach(async (entry) => {
              if (!entry.isIntersecting) return;

              const element = entry.target;
              const photoSource = element.getAttribute("data-photosource");

              if (!photoSource) {
                // Some BoomTown blocks already have their background image inline
                // and therefore have no data-photosource attribute to lazy-load.
                const hasImage =
                  (element.tagName.toLowerCase() === "img" && element.getAttribute("src")) ||
                  (element.style && element.style.backgroundImage && element.style.backgroundImage !== "none");
                if (hasImage) {
                  element.classList.add("fade-in");
                  element.classList.remove("lazy");
                }
                observers.lazy.unobserve(element);
                return;
              }

              try {
                // Show loading indicator or low-res placeholder if available
                if (element.hasAttribute("data-placeholder")) {
                  if (element.tagName.toLowerCase() === "img") {
                    element.src = element.getAttribute("data-placeholder");
                  } else if (element.tagName.toLowerCase() !== "iframe") {
                    // Don't set background for iframes
                    element.style.backgroundImage = `url(${element.getAttribute(
                      "data-placeholder",
                    )})`;
                  }
                }

                // Handle iframes separately - they don't need image processing
                if (element.tagName.toLowerCase() === "iframe") {
                  // For iframes, just set the src attribute directly
                  element.src = photoSource;

                  // Add fade-in class after a small delay to ensure smooth animation
                  setTimeout(() => {
                    element.classList.add("fade-in");
                    element.classList.remove("lazy");

                    // Dispatch custom event to signal iframe loaded
                    element.dispatchEvent(
                      new CustomEvent("iframeLoaded", {
                        bubbles: true,
                      }),
                    );
                  }, 100);

                  observers.lazy.unobserve(element);
                  return;
                }

                // Get target viewport dimensions
                const viewportWidth = window.innerWidth;
                const containerWidth = element.parentElement
                  ? element.parentElement.offsetWidth
                  : viewportWidth;
                const targetWidth = Math.min(
                  viewportWidth,
                  containerWidth || CONFIG.images.fallbackWidth,
                );

                if (element.tagName.toLowerCase() === "img") {
                  element.crossOrigin = "anonymous";

                  // Set loading attribute for native lazy loading as backup
                  if (!element.hasAttribute("loading")) {
                    element.setAttribute("loading", "lazy");
                  }

                  // Process and load the image
                  let finalSrc = photoSource;

                  if (shouldOptimizeImages()) {
                    finalSrc = await downscaleImage(
                      element,
                      photoSource,
                      targetWidth,
                    );
                  }

                  element.onload = () => {
                    element.classList.add("fade-in");
                    element.classList.remove("lazy");
                  };

                  element.src = finalSrc;
                } else {
                  // For background images
                  let finalBg = photoSource;

                  if (shouldOptimizeImages()) {
                    finalBg = await downscaleImage(
                      element,
                      photoSource,
                      targetWidth,
                    );
                  }

                  element.style.backgroundImage = `url(${finalBg})`;
                  element.classList.add("fade-in");
                  element.classList.remove("lazy");
                }
              } catch (error) {
                console.error("Error loading image:", error);
                // Fallback to original image
                if (element.tagName.toLowerCase() === "img") {
                  element.src = photoSource;
                } else {
                  element.style.backgroundImage = `url(${photoSource})`;
                }
                element.classList.add("fade-in");
              }

              observers.lazy.unobserve(element);
            });
          },
          {
            root: null,
            rootMargin: "200px", // Load images 200px before they enter viewport
            threshold: 0.01,
          },
        ),
      ),

      fade: observerRegistry.register(
        "fadeAnimations",
        new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                const element = entry.target;
                // Find and apply all animation classes
                Array.from(element.classList).forEach((className) => {
                  if (className.endsWith("-pre")) {
                    const animationClass = className.replace("-pre", "");
                    element.classList.remove(className);
                    element.classList.add(animationClass);

                    // Add listener to clean up animation classes after they complete
                    const cleanupAnimation = () => {
                      // Remove animation classes to prevent conflicts with future animations
                      element.classList.remove(animationClass + "-active");
                      element.removeEventListener(
                        "animationend",
                        cleanupAnimation,
                      );
                    };

                    element.classList.add(animationClass + "-active");
                    element.addEventListener("animationend", cleanupAnimation);
                  }
                });

                observers.fade.unobserve(element);
              }
            });
          },
          {
            root: null,
            rootMargin: CONFIG.observers.rootMargin,
            threshold: CONFIG.observers.threshold,
          },
        ),
      ),
    };

    // Observe all elements immediately
    document
      .querySelectorAll(".lazy")
      .forEach((el) => observers.lazy.observe(el));
    document
      .querySelectorAll("[class*='-pre']")
      .forEach((el) => observers.fade.observe(el));

    // Set up mutation observer for dynamically added elements
    if (featureSupport.mutationObserver) {
      const mutationObserver = observerRegistry.register(
        "domMutations",
        new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.type === "childList") {
              mutation.addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                  // Check the element itself
                  if (node.classList?.contains("lazy")) {
                    observers.lazy.observe(node);
                  }

                  if (
                    node.className &&
                    typeof node.className === "string" &&
                    node.className.split(" ").some((c) => c.endsWith("-pre"))
                  ) {
                    observers.fade.observe(node);
                  }

                  // Also check children of the added node
                  node
                    .querySelectorAll?.(".lazy")
                    .forEach((el) => observers.lazy.observe(el));

                  node
                    .querySelectorAll?.("[class*='-pre']")
                    .forEach((el) => observers.fade.observe(el));
                }
              });
            }
          });
        }),
      );

      // Observe the entire body for changes
      mutationObserver.observe(document.body, {
        childList: true,
        subtree: true,
      });
    }

    // Return the cleanup function
    return function cleanup() {
      // Remove the animation end handler
      document.removeEventListener("animationend", animationEndHandler, true);

      // Clean up observers
      Object.values(observers).forEach((observer) => {
        if (observer && typeof observer.disconnect === "function") {
          observer.disconnect();
        }
      });

      // Clean up worker
      if (imageWorker) {
        imageWorker.terminate();
        imageWorker = null;
      }
    };
  }
  function setupReadMoreToggles() {
    const toggleButtons = document.querySelectorAll(".toggle-button");
    toggleButtons.forEach((button) => {
      // Look for read-more section in both directions
      let readMoreSection;

      // Try to find it as the next sibling (original implementation)
      if (
        button.nextElementSibling &&
        button.nextElementSibling.classList.contains("read-more")
      ) {
        readMoreSection = button.nextElementSibling;
      }
      // Try to find it as the previous sibling (your new structure)
      else if (
        button.previousElementSibling &&
        button.previousElementSibling.classList.contains("read-more")
      ) {
        readMoreSection = button.previousElementSibling;
      }
      // Look nearby for a read-more section (more flexible approach)
      else {
        // Look in parent's children
        const parent = button.parentElement;
        if (parent) {
          readMoreSection = parent.querySelector(".read-more");
        }
      }

      // If we still can't find it, exit
      if (!readMoreSection) {
        console.warn("No read-more section found for toggle button", button);
        return;
      }

      // Set initial state based on class
      if (button.classList.contains("expanded")) {
        readMoreSection.classList.add("expanded");
        button.textContent = "Read Less";
      } else {
        button.textContent = "Read More";
      }

      // Store initial height for animation
      let sectionHeight = 0;
      let isCalculatingHeight = false;

      function calculateHeight() {
        // Temporarily make visible to measure
        if (isCalculatingHeight) return sectionHeight;

        isCalculatingHeight = true;
        readMoreSection.style.height = "auto";
        readMoreSection.style.opacity = "1";
        readMoreSection.style.position = "absolute";
        readMoreSection.style.visibility = "hidden";
        readMoreSection.style.display = "block";

        sectionHeight = readMoreSection.scrollHeight;

        // Reset to collapsed
        readMoreSection.style.height = "";
        readMoreSection.style.opacity = "";
        readMoreSection.style.position = "";
        readMoreSection.style.visibility = "";
        readMoreSection.style.display = "";

        isCalculatingHeight = false;
        return sectionHeight;
      }

      // Calculate on page load
      setTimeout(calculateHeight, 500);

      // Handle click
      button.addEventListener("click", () => {
        const isExpanded = button.classList.contains("expanded");

        if (isExpanded) {
          // Collapse
          button.classList.remove("expanded");
          readMoreSection.style.height = `${readMoreSection.scrollHeight}px`;

          // Small delay to ensure transition works
          setTimeout(() => {
            readMoreSection.style.height = "0";
            readMoreSection.style.opacity = "0";

            // Remove expanded class after animation
            setTimeout(() => {
              readMoreSection.classList.remove("expanded");
              button.textContent = "Read More";
            }, 500);
          }, 10);
        } else {
          // Expand
          const height = calculateHeight();
          readMoreSection.classList.add("expanded");
          readMoreSection.style.height = "0";

          // Trigger height animation
          setTimeout(() => {
            readMoreSection.style.height = `${height}px`;
            readMoreSection.style.opacity = "1";

            // Set to auto after animation completes
            setTimeout(() => {
              readMoreSection.style.height = "auto";
              button.textContent = "Read Less";
            }, 500);
          }, 10);

          button.classList.add("expanded");
        }
      });

      // Recalculate heights on window resize
      window.addEventListener("resize", calculateHeight);
    });
  }
  function setupFormInjection() {
    const moveBoomTownForm = () => {
      const target = document.querySelector("#contact_us .contact-form-inject");
      if (!target) return false;

      const source = Array.from(document.querySelectorAll(".wp-block-columns")).find(
        (columns) =>
          columns.querySelector(
            '.btgf-form-loader, [data-btgf-form-index], [id^="submit-"]',
          ),
      );
      if (!source) return false;
      if (!target.contains(source)) target.appendChild(source);
      return true;
    };

    if (moveBoomTownForm() || !window.MutationObserver) return;

    const observer = new MutationObserver(() => {
      if (moveBoomTownForm()) observer.disconnect();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }
  function convertArticlesToLinks() {
    const container = document.querySelector("#cherieYoung .design");
    if (!container) return;

    const articles = container.querySelectorAll("article");
    articles.forEach((article) => {
      const link = document.createElement("a");

      // Copy all attributes, including class and href
      for (const attr of article.attributes) {
        link.setAttribute(attr.name, attr.value);
      }

      // Move all child nodes into the new <a> element
      while (article.firstChild) {
        link.appendChild(article.firstChild);
      }

      // Replace <article> with <a>
      article.replaceWith(link);
    });
  }
  function setupCustomNavbar() {
    const bindNavbar = () => {
      const header = document.querySelector("#efirsttexas-navbar");
      if (!header || header.dataset.ftNavbarBound === "true") return;
      const menuToggle = header.querySelector(".ft-navbar__toggle");
      if (!menuToggle) return;
      header.dataset.ftNavbarBound = "true";
      menuToggle.addEventListener("click", () => {
        const open = header.classList.toggle("is-menu-open");
        menuToggle.setAttribute("aria-expanded", String(open));
        menuToggle.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
      });

      header.querySelectorAll(".ft-navbar__dropdown-toggle").forEach((button) => {
        button.addEventListener("click", () => {
          const item = button.closest(".ft-navbar__item--dropdown");
          const open = item.classList.toggle("is-open");
          button.setAttribute("aria-expanded", String(open));
        });
      });

      header.querySelectorAll(".ft-navbar__navigation a").forEach((link) => {
        link.addEventListener("click", () => {
          header.classList.remove("is-menu-open");
          menuToggle.setAttribute("aria-expanded", "false");
          header.querySelectorAll(".ft-navbar__dropdown-toggle").forEach((button) => {
            button.setAttribute("aria-expanded", "false");
            button.closest(".ft-navbar__item--dropdown").classList.remove("is-open");
          });
        });
      });

      if (!window.__efirstTexasNavbarScrollHandler) {
        window.__efirstTexasNavbarScrollHandler = true;
        const updateScrollState = () => {
          document.querySelector("#efirsttexas-navbar")?.classList.toggle("is-scrolled", window.scrollY > 40);
        };
        window.addEventListener("scroll", updateScrollState, { passive: true });
        updateScrollState();
      }
    };

    bindNavbar();
    const navbarObserver = observerRegistry.register(
      "customNavbar",
      new MutationObserver(() => bindNavbar()),
    );
    navbarObserver.observe(document.documentElement, { childList: true, subtree: true });
  }

  function setupHeroVideo() {
    const mountVideo = () => {
      const hero = document.querySelector("#customModule44");
      if (!hero) return false;
      if (hero.querySelector(".hero-video-container")) return true;
      if (window.innerWidth < 768 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;

      const styleId = "efirsttexas-hero-video-styles";
      if (!document.getElementById(styleId)) {
        const style = document.createElement("style");
        style.id = styleId;
        style.textContent = `
          #customModule44 { overflow: hidden !important; isolation: isolate; }
          #customModule44 > .hero-video-container {
            position: absolute; inset: 0; overflow: hidden; z-index: 0;
            pointer-events: none;
          }
          #customModule44 > .hero-video-container iframe {
            position: absolute; top: 50%; left: 50%; width: 100%; height: 100%;
            min-width: 177.78vh; min-height: 56.25vw; border: 0;
            transform: translate(-50%, -50%); pointer-events: none;
          }
          #customModule44 > .hero-heading, #customModule44 > #hero_bar {
            z-index: 1;
          }
        `;
        document.head.appendChild(style);
      }

      const container = document.createElement("div");
      container.className = "hero-video-container";
      container.setAttribute("aria-hidden", "true");

      const iframe = document.createElement("iframe");
      iframe.title = "First Texas Brokerage Company homepage video";
      iframe.src = "https://www.youtube.com/embed/u2O_srjK0qc?autoplay=1&mute=1&controls=0&loop=1&playlist=u2O_srjK0qc&playsinline=1&rel=0&modestbranding=1";
      iframe.allow = "autoplay; encrypted-media; picture-in-picture";
      iframe.tabIndex = -1;
      container.appendChild(iframe);
      hero.insertBefore(container, hero.firstChild);
      return true;
    };

    mountVideo();

    // BoomTown can inject or replace the custom homepage after this script runs.
    // Recheck after DOM updates and restore the iframe if the hero is re-rendered.
    const heroObserver = observerRegistry.register(
      "heroVideo",
      new MutationObserver(() => mountVideo()),
    );
    heroObserver.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  }

  function changeLogo() {
    const logo = document.querySelector("#home43405 > header > div > a > img");
    if (!logo) return;

    logo.src =
      "https://cy-sierra-assets.s3.us-west-1.amazonaws.com/sites/applebaumkc.com/images/logo+nobg.png";
    logo.style.filter = "brightness(0) invert(1)";
  }

  changeLogo();

  setTimeout(() => {
    cherieYoungBranding();
    convertArticlesToLinks();
    setupReadMoreToggles();
  }, 800);

  /**
   * Main initialization function
   */
  function initializeApp() {
    console.log("app initialized in init function");
    setupCustomNavbar();
    setupHeroVideo();

    // Check for critical feature support
    if (!featureSupport.hasRequiredFeatures()) {
      console.warn("Some required features are not supported in this browser.");
    }

    const cleanupLazyLoad = setupLazyLoadAndFade();
    const cleanupFormInjection = setupFormInjection();

    setupNumberAnimation();

    window.addEventListener("beforeunload", () => {
      if (cleanupLazyLoad) cleanupLazyLoad();
      if (cleanupFormInjection) cleanupFormInjection();
      observerRegistry.disconnectAll();
    });

    // Expose public API
    window.animationLib = {
      refresh: () => {
        if (cleanupLazyLoad) cleanupLazyLoad();
        const newCleanup = setupLazyLoadAndFade();
        setupNumberAnimation();
        return newCleanup;
      },
      animateNumber: (selector, number, options = {}) => {
        const el = document.querySelector(selector);
        if (!el) return false;
        el.setAttribute("data-target", "numCount");
        el.setAttribute("data-value", number);
        if (options.start !== undefined)
          el.setAttribute("data-start", options.start);
        if (options.duration)
          el.setAttribute("data-duration", options.duration);
        if (options.easing) el.setAttribute("data-easing", options.easing);
        if (options.formatter)
          el.setAttribute("data-formatter", options.formatter);
        const num = parseInt(number, 10);
        if (!isNaN(num)) {
          el.textContent = num;
          return true;
        }
        return false;
      },
    };
    hasRunScripts = true;
  }
  // Call it immediately
  initializeApp();
}
setTimeout(runScripts, 200);
// Immediately try to run the script
// runScripts();
// Backup initializers
document.addEventListener("DOMContentLoaded", () => runScripts());
window.addEventListener("load", () => runScripts());

// Handle BFCache restore
window.addEventListener("pageshow", (e) => {
  if (e.persisted) {
    console.log("Restored from bfcache — forcing reinit");
    runScripts(true);
  }
});

const WHATSAPP_NUMBER = "917386406514";


/*
 * GA4 helper
 */

function track(eventName, parameters = {}) {

  if (typeof gtag === "function") {

    gtag("event", eventName, parameters);

  }

}


/*
 * Get all currently selected services
 */

function getSelectedServices() {

  return [
    ...document.querySelectorAll(
      '.service-card input[type="checkbox"]:checked'
    )
  ].map(input => input.value);

}


/*
 * Open WhatsApp
 */

function openWhatsApp(
  message,
  source = "service_inquiry",
  extra = {}
) {

  track(
    "whatsapp_click",
    {
      source: source,
      selected_services:
        extra.selected_services || "",
      service_count:
        extra.service_count || 0
    }
  );


  const whatsappURL =
    `https://wa.me/${WHATSAPP_NUMBER}?text=${
      encodeURIComponent(message)
    }`;


  window.open(
    whatsappURL,
    "_blank",
    "noopener,noreferrer"
  );

}


/*
 * Track service selections
 */

document
  .querySelectorAll(
    '.service-card input[type="checkbox"]'
  )
  .forEach(input => {

    input.addEventListener(
      "change",
      () => {

        track(
          "service_selected",
          {
            service: input.value,
            selected:
              input.checked
                ? "true"
                : "false"
          }
        );

      }
    );

  });


/*
 * Main service WhatsApp button
 */

document
  .getElementById("whatsappServiceButton")
  .addEventListener(
    "click",
    () => {

      const services =
        getSelectedServices();


      let message;


      /*
       * If services were selected
       */

      if (services.length > 0) {

        message =
          "Hi Sarvyanta, I am interested in the following makeup artist services:\n\n" +

          services
            .map(service => `• ${service}`)
            .join("\n") +

          "\n\nPlease let me know the available makeup artist options and details.";

      }


      /*
       * If nothing was selected
       *
       * IMPORTANT:
       * Do not block the visitor.
       */

      else {

        message =
          "Hi Sarvyanta, I am interested in makeup artist services. " +
          "Please let me know the available options and details.";

      }


      openWhatsApp(
        message,
        "services_section",
        {
          selected_services:
            services.join(", "),

          service_count:
            services.length
        }
      );

    }
  );


/*
 * General enquiry form
 */

document
  .getElementById("enquiryForm")
  .addEventListener(
    "submit",
    event => {

      event.preventDefault();


      const name =
        document
          .getElementById("name")
          .value
          .trim();


      const location =
        document
          .getElementById("location")
          .value
          .trim();


      const eventDate =
        document
          .getElementById("eventDate")
          .value
          .trim();


      const notes =
        document
          .getElementById("notes")
          .value
          .trim();


      let message =
        "Hi Sarvyanta, I am looking for a makeup artist.";


      if (name) {

        message +=
          `\n\nName: ${name}`;

      }


      if (location) {

        message +=
          `\nLocation: ${location}`;

      }


      if (eventDate) {

        message +=
          `\nEvent date: ${eventDate}`;

      }


      if (notes) {

        message +=
          `\nRequirement: ${notes}`;

      }


      track(
        "enquiry_submitted",
        {
          has_name:
            name ? "true" : "false",

          has_location:
            location ? "true" : "false",

          has_event_date:
            eventDate ? "true" : "false"
        }
      );


      openWhatsApp(
        message,
        "general_enquiry"
      );

    }
  );


/*
 * Track navigation to services
 */

document
  .querySelectorAll(
    'a[href="#services"]'
  )
  .forEach(link => {

    link.addEventListener(
      "click",
      () => {

        track(
          "select_service_area",
          {
            source: "navigation"
          }
        );

      }
    );

  });

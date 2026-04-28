(function () {
  var STORAGE_KEY = "marina_custom_scripts_v1";

  function readConfig() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { head: "", body: "", footer: "" };
      var parsed = JSON.parse(raw);
      return {
        head: parsed.head || "",
        body: parsed.body || "",
        footer: parsed.footer || ""
      };
    } catch (e) {
      return { head: "", body: "", footer: "" };
    }
  }

  function appendScriptsFromHtml(container, html) {
    if (!html || !container) return;

    var wrapper = document.createElement("div");
    wrapper.innerHTML = html;

    Array.prototype.forEach.call(wrapper.childNodes, function (node) {
      if (node.nodeType === 1 && node.tagName.toLowerCase() === "script") {
        var script = document.createElement("script");

        Array.prototype.forEach.call(node.attributes, function (attr) {
          script.setAttribute(attr.name, attr.value);
        });

        if (node.textContent) {
          script.text = node.textContent;
        }

        container.appendChild(script);
      } else if (node.nodeType === 1 || node.nodeType === 3) {
        container.appendChild(node.cloneNode(true));
      }
    });
  }

  function applyScripts() {
    var cfg = readConfig();

    appendScriptsFromHtml(document.head, cfg.head);

    function applyBodyAreas() {
      if (!document.body) return;

      if (cfg.body) {
        var bodyWrap = document.createElement("div");
        bodyWrap.setAttribute("data-custom-script-zone", "body");
        appendScriptsFromHtml(bodyWrap, cfg.body);
        document.body.insertBefore(bodyWrap, document.body.firstChild);
      }

      if (cfg.footer) {
        var footerWrap = document.createElement("div");
        footerWrap.setAttribute("data-custom-script-zone", "footer");
        appendScriptsFromHtml(footerWrap, cfg.footer);
        document.body.appendChild(footerWrap);
      }
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", applyBodyAreas);
    } else {
      applyBodyAreas();
    }
  }

  applyScripts();
})();

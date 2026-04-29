(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
          
  
        form.classList.add('was-validated')
      }, false)
    })

  })()

;(() => {
  'use strict'

  const input = document.getElementById('listing-search')
  const suggestionBox = document.getElementById('listing-search-suggestions')
  const form = input?.closest('form') || null

  const CLEAR_ONCE_KEY = 'listingSearchClearOnce'

  if (!input || !suggestionBox) return

  try {
    if (sessionStorage.getItem(CLEAR_ONCE_KEY) === '1') {
      input.value = ''
      sessionStorage.removeItem(CLEAR_ONCE_KEY)
    }
  } catch {
    // ignore storage access issues
  }

  let lastController = null
  let debounceTimer = null

  function setExpanded(isExpanded) {
    input.setAttribute('aria-expanded', String(isExpanded))
  }

  function hideSuggestions() {
    suggestionBox.classList.add('d-none')
    suggestionBox.innerHTML = ''
    setExpanded(false)
  }

  function showSuggestions() {
    suggestionBox.classList.remove('d-none')
    setExpanded(true)
  }

  // function liveFilterListings(query) {
    // Intentionally disabled: keep listing cards unchanged while typing.
    // (Search results are shown only after form submit.)
  //   void query
  // }

  function createHighlightedTitle(title, query) {
    const text = String(title || '')
    const q = String(query || '').trim()
    if (!q) return document.createTextNode(text)

    const lowerText = text.toLowerCase()
    const lowerQ = q.toLowerCase()
    const index = lowerText.indexOf(lowerQ)
    if (index === -1) return document.createTextNode(text)

    const frag = document.createDocumentFragment()
    frag.append(document.createTextNode(text.slice(0, index)))
    const strong = document.createElement('strong')
    strong.textContent = text.slice(index, index + q.length)
    frag.append(strong)
    frag.append(document.createTextNode(text.slice(index + q.length)))
    return frag
  }

  function submitSearchWithValue(value) {
    input.value = value
    hideSuggestions()

    // After navigating to results, clear the navbar input once.
    try {
      sessionStorage.setItem(CLEAR_ONCE_KEY, '1')
    } catch {
      // ignore storage access issues
    }

    if (form) {
      if (typeof form.requestSubmit === 'function') form.requestSubmit()
      else form.submit()
    }
  }

  function renderSuggestions(items, query) {
    const q = String(query || '').trim()
    const list = Array.isArray(items) ? items : []

    suggestionBox.innerHTML = ''

    if (!q) {
      hideSuggestions()
      return
    }

    if (list.length === 0) {
      const btn = document.createElement('button')
      btn.type = 'button'
      btn.className = 'list-group-item list-group-item-action'
      btn.setAttribute('role', 'option')
      btn.id = 'listing-suggest-empty'
      btn.addEventListener('mousedown', (e) => e.preventDefault())
      btn.addEventListener('click', () => submitSearchWithValue(q))

      const line1 = document.createElement('div')
      line1.className = 'fw-semibold'
      line1.textContent = 'No listings found' 
      const line2 = document.createElement('div')
      line2.className = 'text-muted small'
      line2.textContent = `Search for "${q}"`

      btn.append(line1, line2)
      suggestionBox.appendChild(btn)
      showSuggestions()
      return
    }

    list.forEach((item, idx) => {
      const btn = document.createElement('button')
      btn.type = 'button'
      btn.className = 'list-group-item list-group-item-action'
      btn.setAttribute('role', 'option')
      btn.id = `listing-suggest-${idx}`
      btn.addEventListener('mousedown', (e) => e.preventDefault())
      btn.addEventListener('click', () => submitSearchWithValue(item.title))

      btn.appendChild(createHighlightedTitle(item.title, q))
      suggestionBox.appendChild(btn)
    })

    showSuggestions()
  }

  async function fetchSuggestions(query) {
    const trimmed = (query || '').trim()
    if (!trimmed) {
      hideSuggestions()
      return
    }

    if (lastController) lastController.abort()
    lastController = new AbortController()

    const url = `/listings/suggest?q=${encodeURIComponent(trimmed)}`
    const res = await fetch(url, {
      headers: { 'Accept': 'application/json' },
      signal: lastController.signal,
    })

    if (!res.ok) {
      hideSuggestions()
      return
    }

    const data = await res.json()
    renderSuggestions(Array.isArray(data.suggestions) ? data.suggestions : [], trimmed)
  }

  input.addEventListener('input', () => {
    const value = input.value
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
      fetchSuggestions(value).catch(() => {
        // ignore network errors
      })
    }, 200)
  })

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      hideSuggestions()
      input.blur()
    }
  })

  document.addEventListener('click', (e) => {
    const target = e.target
    if (!(target instanceof Element)) return
    if (target === input) return
    if (suggestionBox.contains(target)) return
    hideSuggestions()
  })

  input.addEventListener('blur', () => {
    // allow click selection first
    setTimeout(() => hideSuggestions(), 120)
  })

  // Initialize filtering if page loads with query
  // liveFilterListings(input.value)
})()

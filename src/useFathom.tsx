import React from 'react'

type WindowLocationn = Window['location'] & Location

declare global {
  interface Window { fathom: any; }
}

type FathomProps = {
  host: string,
  siteId: string
}

type TrackPageViewParams = {
  url?: string,
  referrer?: string
}

function useFathom (options: FathomProps) {
  const { siteId, host } = options
  const ref = React.useRef(false)
  const src = `${host}/tracker.js`
  
  const trackPageview = (params?: TrackPageViewParams) => {
    if (!ref.current) {
      return
    }

    window.fathom('trackPageview', params)
  }

  const onLoad = () => {
    ref.current = true
  }

  React.useEffect(() => {
    const script = document.createElement('script')
    script.async = true
    script.id = 'fathom-script'
    script.src = src
    script.onload = onLoad
    window.fathom = window.fathom || function () {
      (window.fathom.q = window.fathom.q || []).push(arguments)
    }
    const ref = document.getElementsByTagName('script')[0]
    ref.parentNode.insertBefore(script, ref)
    window.fathom('set', 'siteId', siteId)
  }, [])

  return [trackPageview]
} 

export default useFathom
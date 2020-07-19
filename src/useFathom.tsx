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

export const FATHOM_SCRIPT_ID = 'fathom-script'

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
    trackPageview()
  }

  React.useEffect(() => {
    if (
      document.getElementById(FATHOM_SCRIPT_ID)
    ) {
      return
    }
    const script = document.createElement('script')
    script.async = true
    script.id = FATHOM_SCRIPT_ID
    script.src = src
    script.onload = onLoad
    window.fathom = window.fathom || function () {
      (window.fathom.q = window.fathom.q || []).push(arguments)
    }
    const node = document.getElementsByTagName('script')[0]
    node.parentNode.insertBefore(script, node)
    window.fathom('set', 'siteId', siteId)
  }, [])

  return [trackPageview]
} 

export default useFathom
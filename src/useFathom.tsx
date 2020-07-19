import React from 'react'

declare global {
  interface Window { fathom: any; }
}

type FathomProps = {
  host: string,
  siteId: string,
  onLoad?: (evt: any) => any
}

function useFathom (props: FathomProps) {
  const { siteId, host, onLoad } = props
  const ref = React.useRef(null)
  const src = `${host}/tracker.js`
  
  const trackPageview = () => {
    window.fathom('trackPageview')
  }

  React.useEffect(() => {
    const script = document.createElement('script')
    script.async = true
    script.id = 'fathom-script'
    script.src = src
    if (onLoad) {
      script.onload = onLoad
    }
    window.fathom = window.fathom || function () {
      (window.fathom.q = window.fathom.q || []).push(arguments)
    }
    const ref = document.getElementsByTagName('script')[0]
    ref.parentNode.insertBefore(script, ref)
    window.fathom('set', 'siteId', siteId)
    trackPageview()
    // @ts-ignore
    ref.current = window.fathom
  }, [])

  return [trackPageview]
} 

export default useFathom
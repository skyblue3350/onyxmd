import { SessionProvider as Provider } from 'next-auth/react'

import '../styles/globals.css'
import 'semantic-ui-css/semantic.min.css'
import 'highlight.js/styles/github-dark.css'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material.css'
import 'codemirror/theme/idea.css'
import 'codemirror/theme/monokai.css'
import 'github-markdown-css/github-markdown-dark.css'

function MyApp({Component, pageProps}) {
  return <Provider session={pageProps.session}><Component {...pageProps} /></Provider>
}

export default MyApp

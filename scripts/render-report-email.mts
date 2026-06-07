import { readFileSync } from 'node:fs'
import { renderReportReadyEmail } from '../src/emails/renderReportReadyEmail.ts'

const input = readFileSync(0, 'utf8')
const props = JSON.parse(input)
const html = await renderReportReadyEmail(props)
process.stdout.write(html)

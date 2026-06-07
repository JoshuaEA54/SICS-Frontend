import { render } from '@react-email/render'
import { ReportReadyEmail, type ReportReadyEmailProps } from './ReportReadyEmail'

export async function renderReportReadyEmail(props: ReportReadyEmailProps): Promise<string> {
  return render(ReportReadyEmail(props))
}

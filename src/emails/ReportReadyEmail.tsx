import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components'
import { emailTokens } from './tokens'

export interface ReportReadyEmailProps {
  companyName: string
  compliancePercentage: number
  complianceLabel: string
  complianceColor: string
  expertName: string
  reviewedAt: string
  appUrl: string
  logoSrc: string
}

export function ReportReadyEmail({
  companyName,
  compliancePercentage,
  complianceLabel,
  complianceColor,
  expertName,
  reviewedAt,
  appUrl,
  logoSrc,
}: ReportReadyEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Informe SICS listo: {companyName}</Preview>
      <Body style={{ backgroundColor: emailTokens.surfaceBg, fontFamily: 'Arial, sans-serif', margin: 0 }}>
        <Container
          style={{
            backgroundColor: emailTokens.surface,
            border: `1px solid ${emailTokens.border}`,
            borderRadius: '12px',
            margin: '24px auto',
            maxWidth: '560px',
            padding: '32px',
          }}
        >
          <Row style={{ marginBottom: '8px' }}>
            <Column style={{ width: '52px', verticalAlign: 'top' }}>
              <Img
                src={logoSrc}
                alt="SICS"
                width="44"
                height="44"
                style={{ display: 'block' }}
              />
            </Column>
            <Column style={{ verticalAlign: 'middle' }}>
              <Heading
                style={{
                  color: emailTokens.textPrimary,
                  fontSize: '22px',
                  fontWeight: 600,
                  margin: 0,
                }}
              >
                Informe de evaluación disponible
              </Heading>
            </Column>
          </Row>
          <Text style={{ color: emailTokens.textSecondary, fontSize: '14px', lineHeight: '22px', margin: '0 0 20px' }}>
            La evaluación de seguridad de <strong>{companyName}</strong> fue revisada por{' '}
            <strong>{expertName}</strong> el {reviewedAt}. Adjuntamos el informe PDF con el detalle de
            cumplimiento.
          </Text>

          <Section
            style={{
              backgroundColor: emailTokens.surfaceBg,
              border: `1px solid ${emailTokens.border}`,
              borderRadius: '8px',
              marginBottom: '24px',
              padding: '16px 20px',
            }}
          >
            <Text style={{ color: emailTokens.textMuted, fontSize: '12px', margin: '0 0 4px', textTransform: 'uppercase' }}>
              Nivel de cumplimiento
            </Text>
            <Text style={{ color: complianceColor, fontSize: '28px', fontWeight: 700, margin: '0 0 4px' }}>
              {compliancePercentage}%
            </Text>
            <Text style={{ color: complianceColor, fontSize: '14px', fontWeight: 600, margin: 0 }}>
              {complianceLabel}
            </Text>
          </Section>

          <Button
            href={appUrl}
            style={{
              backgroundColor: emailTokens.primary,
              borderRadius: '8px',
              color: '#ffffff',
              display: 'inline-block',
              fontSize: '14px',
              fontWeight: 600,
              padding: '12px 24px',
              textDecoration: 'none',
            }}
          >
            Ver mis evaluaciones
          </Button>

          <Hr style={{ borderColor: emailTokens.border, margin: '28px 0 16px' }} />
          <Text style={{ color: emailTokens.textMuted, fontSize: '12px', lineHeight: '18px', margin: 0 }}>
            SICS: Sistema Integrado de Cumplimiento en Seguridad.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export default ReportReadyEmail

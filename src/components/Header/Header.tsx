import { AppBar, Headline, colors } from '@door2door/web-components'
import { D2DLogo } from '@door2door/web-components/icons'

export function Header() {
  return (
    <>
    <AppBar
      componentLogo={<D2DLogo styles={{fontSize: "40px"}}/>}
      language="en"
      onLogoutClick={() => alert('Logout clicked')}
      hideFeedbackButton
      title={<Headline style={{marginLeft: "8px"}} variant="level4" color={colors.darkGray}>Katja Diehl :: She Drives Mobility</Headline>}
      userInfo={{
        firstName: 'Greyce',
        lastName: 'Riquinho',
        email: 'greyce@door2door.io',
        organization: {
          displayName: 'door2door',
          logoURL: 'https://media-exp1.licdn.com/dms/image/C4E0BAQEzwHW46HF_5w/company-logo_200_200/0/1538995105763?e=2159024400&v=beta&t=LJyNp1ZQxCsPb91WoWNgUg6BPNHgKrRLVcwR7bPznF8'
        }
      }}
    />
    </>
  )
}

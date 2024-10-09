import { useAppSelector } from '../app/hooks'
import { selectAccessToken, selectClaims } from '../features/user/userSlice'

function App() {

  const claims = useAppSelector(selectClaims);
  const accessToken = useAppSelector(selectAccessToken);

  return (
    <>
      <p>Claims: {JSON.stringify(claims)}</p>
      <p>Claims: {(claims as any)?.name ? (claims as any).name : 'No name available'}</p>
      <p>Access Token: {accessToken}</p>
    </>
  )
}

export default App
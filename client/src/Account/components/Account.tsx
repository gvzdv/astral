import { FC } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import { useErrorHandler } from 'react-error-boundary'

// account
import { QUERY_ACCOUNT_BY_ID } from 'Account/query'
import { AccountDetailsCard, AccountDetailsTabs } from 'Account/components'

// common
import { Spinner } from 'common/components'

// layout
import { NotFound } from 'layout/components'
import useMediaQuery from 'common/hooks/useMediaQuery'
import { formatAddress } from 'common/helpers/formatAddress'

const Account: FC = () => {
  const { accountId } = useParams<{ accountId?: string }>()

  const convertedAddress = formatAddress(accountId)

  const isDesktop = useMediaQuery('(min-width: 1440px)')

  const { data, error, loading } = useQuery(QUERY_ACCOUNT_BY_ID, {
    variables: { accountId: convertedAddress },
  })

  useErrorHandler(error)

  if (!convertedAddress) {
    return <NotFound />
  }

  if (loading) {
    return <Spinner />
  }

  if (!data.accountById) {
    return <NotFound />
  }

  const account = data.accountById

  return (
    <div className='w-full'>
      <AccountDetailsCard account={account} accountAddress={convertedAddress} />
      <AccountDetailsTabs extrinsics={account.extrinsics} isDesktop={isDesktop} />
    </div>
  )
}

export default Account

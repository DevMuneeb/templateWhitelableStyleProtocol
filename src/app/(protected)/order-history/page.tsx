import { ContractImage } from '@/components/ui/contractImage'
import { Partners } from '@/components/ui/partners'
import OrderHistoryScreen from '@/screens/OrderHistoryScreen'

export const dynamic = 'force-dynamic'

const Page = () => {
  return (
    <div>
      {/* <Partners /> */}
      <OrderHistoryScreen />
      {/* <ContractImage /> */}
    </div>
  )
}

export default Page

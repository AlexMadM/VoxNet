import { Input, Typography } from '@/shared/ui'
import s from '@/widgets/addLocation/ui/AddLocation.module.css'
import { GeoPoint } from '@/shared/ui/icons/GeoPoint'

export const AddLocation = () => {
  return (
    <div className={s.wrapper}>
      <Input label="Add location" type="text" id="location" placeholder="New York" className={s.inputCustom} />
      {/*<GeoPoint width={24} height={24} />*/}
      <div className={s.containerGeo}>
        <Typography variant="regular_16">New York</Typography>
        <Typography variant="small">Washington Square Park</Typography>
      </div>
      <div className={s.containerGeo}>
        <Typography variant="regular_16">New York</Typography>
        <Typography variant="small">Washington Square Park</Typography>
      </div>
    </div>
  )
}

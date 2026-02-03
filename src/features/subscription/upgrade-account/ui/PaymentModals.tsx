import { Button, Checkbox, Dialog, DialogContent, Typography } from '@/shared/ui'
import s from './UpgradeAccount.module.css'

type Props = {
  createPaymentOpen: boolean
  successOpen: boolean
  errorOpen: boolean
  agree: boolean
  isCreating: boolean
  onAgreeChange: (v: boolean) => void
  onConfirm: () => void
  onCloseCreate: (open: boolean) => void
  onCloseSuccess: (open: boolean) => void
  onCloseError: (open: boolean) => void
}

export const PaymentModals = ({
  createPaymentOpen,
  successOpen,
  errorOpen,
  agree,
  isCreating,
  onAgreeChange,
  onConfirm,
  onCloseCreate,
  onCloseSuccess,
  onCloseError
}: Props) => {
  const handleCloseCreate = (open: boolean) => {
    if (!open) {
      onAgreeChange(false)
    }
    onCloseCreate(open)
  }

  return (
    <>
      {/* Create payment */}
      <Dialog open={createPaymentOpen} onOpenChange={handleCloseCreate}>
        <DialogContent title="Create payment" showCloseButton>
          <Typography variant="regular_14" color="light" className={s.modalText}>
            Auto-renewal will be enabled with this payment. You can disable it anytime in your profile settings
          </Typography>

          <div className={s.agreeSection}>
            <Checkbox label="I agree" checked={agree} onCheckedChange={(checked) => onAgreeChange(Boolean(checked))} />
            <Button variant="primary" onClick={onConfirm} disabled={!agree || isCreating}>
              OK
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success */}
      <Dialog open={successOpen} onOpenChange={onCloseSuccess}>
        <DialogContent title="Success" showCloseButton>
          <Typography variant="regular_14" color="light" className={s.modalText}>
            Payment was successful!
          </Typography>

          <div className={s.modalFooter}>
            <Button variant="primary" onClick={() => onCloseSuccess(false)}>
              OK
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Error */}
      <Dialog open={errorOpen} onOpenChange={onCloseError}>
        <DialogContent title="Error" showCloseButton>
          <Typography variant="regular_14" color="light" className={s.modalText}>
            Transaction failed. Please, write to support
          </Typography>

          <div className={s.modalFooter}>
            <Button variant="primary" onClick={() => onCloseError(false)}>
              Back to payment
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

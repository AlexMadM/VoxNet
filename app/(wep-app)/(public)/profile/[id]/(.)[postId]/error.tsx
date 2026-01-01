'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogClose } from '@/shared/ui/modal'
import { Close, Button } from '@/shared/ui'

type ErrorProps = {
  error: Error & { digest?: string }
  reset: () => void
}

/**
 * Error Boundary для intercepting route поста (модальное окно)
 * Автоматически перехватывает ошибки из Server Components и Client Components
 */
export default function PostModalError({ error, reset }: ErrorProps) {
  const router = useRouter()

  useEffect(() => {
    // Логируем ошибку для отладки
    console.error('Post modal error:', error)
  }, [error])

  const handleBack = () => {
    router.back()
  }

  return (
    <Dialog open={true} onOpenChange={() => handleBack()}>
      <DialogContent showCloseButton={false} className="modal-content">
        <DialogClose className="close-button" aria-label="Закрыть">
          <Close />
        </DialogClose>
        <div style={{ padding: '24px', textAlign: 'center' }}>
          <h2 style={{ marginBottom: '16px', fontSize: '20px', fontWeight: '600' }}>Ошибка загрузки поста</h2>
          <p style={{ marginBottom: '24px', color: '#666' }}>
            {error.message || 'Произошла ошибка при загрузке поста'}
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <Button variant="outlined" onClick={handleBack}>
              Вернуться назад
            </Button>
            <Button variant="primary" onClick={reset}>
              Попробовать снова
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

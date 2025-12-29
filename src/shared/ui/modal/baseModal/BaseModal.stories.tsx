import { useState } from 'react'

import Image from 'next/image'

import { Meta, StoryObj } from '@storybook/nextjs'
import { Button } from '@/shared/ui'
import { BaseModal, DialogClose } from '@/shared/ui/modal'
import styles from './BaseModal.stories.module.css'
import { MoreIcon } from '@/shared/ui/icons/MoreIcon'

const COMMENT_TEXT = 'Lorem ipsum dolor sit amet, consectetur adipunt ut .'

const meta = {
  title: 'Components/BaseModal',
  component: BaseModal,
  parameters: {
    layout: 'centered'
  }
} satisfies Meta<typeof BaseModal>

export default meta

type Story = StoryObj<typeof meta>

/**
 * Примечание: истории ниже демонстрируют разные конфигурации `BaseModal`.
 * Меняйте триггер открытия и структуру контента под конкретный сценарий,
 * а состояние `open` всегда контролируйте снаружи через проп `onOpenChange`.
 */
export const WithHeader: Story = {
  render: () => {
    const [open, setOpen] = useState(true)

    return (
      <div>
        {/* Кнопка здесь как триггер для открытия модалки
        На проекте вместо кнопки будет какойто другой элемент на который будем вешать setOpen(true) */}
        <Button onClick={() => setOpen(true)}>Открыть модалку</Button>
        <BaseModal title={'Заголовок модалки!'} open={open} onOpenChange={setOpen}>
          {/* Основной контент модалки располагается здесь. *
          *сюда также можно добавлять кнопки закрытия и другие элементы управления модалки
          их можно посмотреть в Modal.tsx

          */}
          Я Модалка ! Очень счастливая и разнообразная!
        </BaseModal>
      </div>
    )
  }
}

export const WithoutHeader: Story = {
  render: () => {
    const [open, setOpen] = useState(true)
    {
      /* если нужно без хедера просто прокидываешь
      пропсом showCloseButton={false} и не прокидываешь title

          */
    }
    return (
      <div>
        <Button onClick={() => setOpen(true)}>Открыть модалку</Button>
        <BaseModal showCloseButton={false} open={open} onOpenChange={setOpen}>
          <p>Я модалка! НЕ Очень счастливая и НЕ разнообразная!</p>
        </BaseModal>
      </div>
    )
  }
}

export const WithCloseButton: Story = {
  render: () => {
    const [open, setOpen] = useState(true)

    return (
      <div>
        <Button onClick={() => setOpen(true)}>Открыть модалку</Button>
        <BaseModal title={'Ура!'} showCloseButton={false} open={open} onOpenChange={setOpen}>
          <p>у меня есть кнопка )) Ширина модалки устанавливается по контенту !</p>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <DialogClose asChild>
              <Button>Закрыть</Button>
            </DialogClose>
          </div>
        </BaseModal>
      </div>
    )
  }
}

export const PostPreview: Story = {
  render: () => {
    const [open, setOpen] = useState(true)

    return (
      <div>
        <Button onClick={() => setOpen(true)}>Показать превью поста</Button>
        <BaseModal className={styles.postModal} showCloseButton={false} open={open} onOpenChange={setOpen}>
          <div className={styles.postShell}>
            <DialogClose asChild>
              <button className={styles.closeButton} aria-label="Закрыть превью">
                ×
              </button>
            </DialogClose>

            <div className={styles.postLayout}>
              <div className={styles.imageColumn}>
                <button
                  type="button"
                  className={`${styles.carouselControl} ${styles.carouselControlPrev}`}
                  aria-label="Назад"
                >
                  ‹
                </button>
                <Image
                  src="/img.png"
                  alt="Превью публикации"
                  fill
                  priority
                  sizes="(max-width: 900px) 100vw, 900px"
                  className={styles.image}
                />
                <button
                  type="button"
                  className={`${styles.carouselControl} ${styles.carouselControlNext}`}
                  aria-label="Вперёд"
                >
                  ›
                </button>
              </div>

              <aside className={styles.sidebar}>
                <header className={styles.sidebarHeader}>
                  <div>
                    <p className={styles.profileName}>URLProfile</p>
                    <p className={styles.postDate}>2 часа назад</p>
                  </div>
                  <MoreIcon className={styles.menuHint} />
                </header>

                <section className={styles.comments} aria-label="Комментарии">
                  {[1, 2, 3].map((item) => (
                    <article key={item} className={styles.comment}>
                      <p className={styles.commentAuthor}>URLProfile</p>
                      <p className={styles.commentText}>{COMMENT_TEXT}</p>
                    </article>
                  ))}
                </section>

                <footer className={styles.sidebarFooter}>
                  <p className={styles.likes}>2 243 отметки «Нравится»</p>
                  <p className={styles.timestamp}>3 июля 2021</p>
                  <div className={styles.addComment}>
                    <input placeholder="Добавьте комментарий..." />
                    <button onClick={() => setOpen(false)}>Опубликовать</button>
                  </div>
                </footer>
              </aside>
            </div>
          </div>
        </BaseModal>
      </div>
    )
  }
}

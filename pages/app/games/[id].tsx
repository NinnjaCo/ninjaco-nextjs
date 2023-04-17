import { GetServerSideProps } from 'next'
import { User } from '@/models/crud'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { getServerSession } from 'next-auth'
import { jsonBlocks } from '@/blockly/blocks/json'
import { jsonGenerator } from '@/blockly/generetors/json'
import { jsonToolbox } from '@/blockly/toolbox/json'
import BlocklyBoard from '@/components/blockly/blockly'
import Head from 'next/head'
import Link from 'next/link'
import React from 'react'
import UserMenu from '@/components/user/userMenu'
import useTranslation from '@/hooks/useTranslation'

interface ServerSideProps {
  user: User
  gameId: string
}

const ViewGame = ({ user, gameId }: ServerSideProps) => {
  const t = useTranslation()

  return (
    <>
      <Head>
        <title>NinjaCo | Play Game</title>
        <meta name="description" content="Play games in ninjaco now!" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="relative h-screen w-full">
        <UserMenu isOnCoursePage={false} isOnGamesPage={true} user={user} />
        <div className="grid md:hidden items-center h-screen grid-cols-1 justify-items-center py-24 px-8 relative flex-auto">
          <h1 className="self-end divide-x-2 divide-brand text-sm ">
            <span className="px-2 font-bold">{t.Creator.games.createGame.mobileError}</span>
          </h1>
          <Link href="/app/games" className="self-start my-4 text-sm btn btn-brand">
            {t.Creator.games.createGame.goBack}
          </Link>
        </div>
        <div className="hidden md:flex w-full h-5/6">
          <BlocklyBoard
            blocklyOptions={{
              toolbox: jsonToolbox,
              grid: {
                spacing: 20,
                colour: '#ccc',
                length: 3,
                snap: true,
              },
              comments: false,
              maxBlocks: 10,
              trashcan: true,
              modalInputs: true,
              zoom: {
                controls: true,
                wheel: true,
                startScale: 1.0,
                maxScale: 3,
                minScale: 0.3,
                scaleSpeed: 1.2,
              },
            }}
            codeGenerator={jsonGenerator}
            blocksDefinitions={jsonBlocks}
          />
        </div>
      </main>
    </>
  )
}

export default ViewGame

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { query, req, res } = context
  const { id } = query

  const session = await getServerSession(req, res, authOptions)
  if (!session) {
    return {
      redirect: {
        destination:
          (query.redirectTo as string | undefined) || '/auth/signup?error=Token%20Expired',
        permanent: false,
      },
    }
  }

  return {
    props: {
      user: session.user,
      gameId: id,
    },
  }
}

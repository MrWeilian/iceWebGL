import * as path from 'path'
import * as fsPromises from 'fs/promises'
import { chineseSortFn, contentBasePath } from './create-side-bar';

const outPutBasePath = () => {
  return path.resolve(contentBasePath(), './一、前言')
}

const getDirectory = async (): Promise<directoryTree[]> => {
  const resolvePath = contentBasePath()

  const dirArr = await fsPromises.readdir(resolvePath)

  return Promise.all(dirArr
    .sort(chineseSortFn)
    .map(async (dirItemPath: string, dirIndex) => {
    const dirPath = `${resolvePath}/${dirItemPath}`

    const fileArr = await fsPromises.readdir(dirPath)
    if (dirIndex === 0) {
      // 目录文件不需要生成目录，直接删除
      fileArr.splice(0, 1)
    }
    const fileContentArr = []
    for (const file of fileArr) {
      const contentBuffer = await fsPromises.readFile(path.resolve(resolvePath, dirItemPath, file))
      const fileStr = contentBuffer.toString('utf8')
      const firstTitleReg = /(?<=(#))\s.+(?=\n)/g
      const secondTitleReg = /(?<=(\n#{2}\s)).+?(?=\n)/g

      const firstTitle = fileStr.match(firstTitleReg)?.[0].trim()
      const secondTitles = fileStr.match(secondTitleReg)

      firstTitle && fileContentArr.push({
        title: `[${firstTitle}](/content/${dirItemPath}/${encodeURIComponent(firstTitle)})`,
        // 总结不生成目录
        children: secondTitles
          ?.filter(_ => !_.includes('总结'))
          .map(_ => ({
            // url hash 需要处理成小写字母；符号 ` 、 空格、需要转换成 -
            title: `[${_}](/content/${dirItemPath}/${encodeURIComponent(firstTitle)}.html#${_.trim().toLowerCase().replaceAll('`', '').replaceAll(' ', '-')})`
          }))
      })
    }

    return {
      title: dirItemPath,
      children: fileContentArr
    }
  }))
}

interface directoryTree {
  title: string
  children: directoryTree[]
}

const treeTitle = (directoryTree: directoryTree[], deep = 0): string => {
  return directoryTree.reduce((acc, cur) => {
    const TAB = new Array(deep).fill('   ')
    acc += deep > 0 ? [...TAB, `- ${cur.title}\n\n`].join('') : `## ${cur.title}\n\n`
    if (cur.children) {
      acc += treeTitle(cur.children, deep + 1)
    }
    return acc
  }, '')
}

export default function createDirectory () {
  return {
    buildStart: async () => {
      const outPutFile = `${outPutBasePath()}/0. 目录.md`
      // try {
      //   const stat = await fsPromises.stat(outPutFile)
      //   if (stat.isFile()) {
      //     await fsPromises.unlink(outPutFile)
      //   }
      // } catch (e) {
      //
      // }
      const directoryTree = await getDirectory()

      const everyTitleStr = treeTitle(directoryTree)

      const directoryStr = `# 👉 目录大纲
${everyTitleStr}
`
      await fsPromises.writeFile(outPutFile, directoryStr, {
        encoding: 'utf-8'
      })
    }
  }
}

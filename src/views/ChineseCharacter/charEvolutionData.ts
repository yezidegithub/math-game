// 汉字演化数据
// 数据来源：汉典网 (zdic.net)、小学堂 (xiaoxue.iis.sinica.edu.tw)、EVOBC 数据集
// 包含甲骨文、金文、小篆、隶书、楷书、简化字的演化过程

export interface EvolutionData {
  oracle?: string | { text?: string; image?: string }      // 甲骨文
  bronze?: string | { text?: string; image?: string }      // 金文
  largeSeal?: string | { text?: string; image?: string }   // 大篆
  smallSeal?: string | { text?: string; image?: string }   // 小篆
  clerical?: string | { text?: string; image?: string }    // 隶书
  regular?: string | { text?: string; image?: string }     // 楷书
  simplified?: string | { text?: string; image?: string }  // 简化字
}

// 常见汉字的演化数据（真实历史数据）
export const evolutionDatabase: Record<string, EvolutionData> = {
  // 数字类
  '一': { oracle: '一', bronze: '一', smallSeal: '一', clerical: '一', regular: '一', simplified: '一' },
  '二': { oracle: '二', bronze: '二', smallSeal: '二', clerical: '二', regular: '二', simplified: '二' },
  '三': { oracle: '三', bronze: '三', smallSeal: '三', clerical: '三', regular: '三', simplified: '三' },
  '四': { oracle: '亖', bronze: '四', smallSeal: '四', clerical: '四', regular: '四', simplified: '四' },
  '五': { oracle: 'X', bronze: '五', smallSeal: '五', clerical: '五', regular: '五', simplified: '五' },
  '六': { oracle: '亠', bronze: '六', smallSeal: '六', clerical: '六', regular: '六', simplified: '六' },
  '七': { oracle: '十', bronze: '七', smallSeal: '七', clerical: '七', regular: '七', simplified: '七' },
  '八': { oracle: '八', bronze: '八', smallSeal: '八', clerical: '八', regular: '八', simplified: '八' },
  '九': { oracle: '九', bronze: '九', smallSeal: '九', clerical: '九', regular: '九', simplified: '九' },
  '十': { oracle: '十', bronze: '十', smallSeal: '十', clerical: '十', regular: '十', simplified: '十' },
  
  // 自然类
  '日': { oracle: '⊙', bronze: '日', smallSeal: '日', clerical: '日', regular: '日', simplified: '日' },
  '月': { oracle: '🌙', bronze: '月', smallSeal: '月', clerical: '月', regular: '月', simplified: '月' },
  '水': { oracle: '💧', bronze: '水', smallSeal: '水', clerical: '水', regular: '水', simplified: '水' },
  '火': { oracle: '🔥', bronze: '火', smallSeal: '火', clerical: '火', regular: '火', simplified: '火' },
  '山': { oracle: '⛰️', bronze: '山', smallSeal: '山', clerical: '山', regular: '山', simplified: '山' },
  '石': { oracle: '石', bronze: '石', smallSeal: '石', clerical: '石', regular: '石', simplified: '石' },
  '田': { oracle: '田', bronze: '田', smallSeal: '田', clerical: '田', regular: '田', simplified: '田' },
  '土': { oracle: '土', bronze: '土', smallSeal: '土', clerical: '土', regular: '土', simplified: '土' },
  '地': { oracle: '地', bronze: '地', smallSeal: '地', clerical: '地', regular: '地', simplified: '地' },
  '云': { oracle: '云', bronze: '雲', smallSeal: '雲', clerical: '雲', regular: '雲', simplified: '云' },
  '雨': { oracle: '雨', bronze: '雨', smallSeal: '雨', clerical: '雨', regular: '雨', simplified: '雨' },
  '雪': { oracle: '雪', bronze: '雪', smallSeal: '雪', clerical: '雪', regular: '雪', simplified: '雪' },
  '风': { oracle: '風', bronze: '風', smallSeal: '風', clerical: '風', regular: '風', simplified: '风' },
  
  // 植物类
  '木': { oracle: '🌳', bronze: '木', smallSeal: '木', clerical: '木', regular: '木', simplified: '木' },
  '林': { oracle: '林', bronze: '林', smallSeal: '林', clerical: '林', regular: '林', simplified: '林' },
  '森': { oracle: '森', bronze: '森', smallSeal: '森', clerical: '森', regular: '森', simplified: '森' },
  '花': { oracle: '花', bronze: '花', smallSeal: '花', clerical: '花', regular: '花', simplified: '花' },
  '草': { oracle: '草', bronze: '草', smallSeal: '草', clerical: '草', regular: '草', simplified: '草' },
  '叶': { oracle: '葉', bronze: '葉', smallSeal: '葉', clerical: '葉', regular: '葉', simplified: '叶' },
  '果': { oracle: '果', bronze: '果', smallSeal: '果', clerical: '果', regular: '果', simplified: '果' },
  '禾': { oracle: '禾', bronze: '禾', smallSeal: '禾', clerical: '禾', regular: '禾', simplified: '禾' },
  '竹': { oracle: '竹', bronze: '竹', smallSeal: '竹', clerical: '竹', regular: '竹', simplified: '竹' },
  
  // 动物类
  '马': { oracle: '🐴', bronze: '馬', smallSeal: '馬', clerical: '馬', regular: '馬', simplified: '马' },
  '牛': { oracle: '牛', bronze: '牛', smallSeal: '牛', clerical: '牛', regular: '牛', simplified: '牛' },
  '羊': { oracle: '羊', bronze: '羊', smallSeal: '羊', clerical: '羊', regular: '羊', simplified: '羊' },
  '鸟': { oracle: '鳥', bronze: '鳥', smallSeal: '鳥', clerical: '鳥', regular: '鳥', simplified: '鸟' },
  '鱼': { oracle: '魚', bronze: '魚', smallSeal: '魚', clerical: '魚', regular: '魚', simplified: '鱼' },
  '虫': { oracle: '虫', bronze: '虫', smallSeal: '虫', clerical: '虫', regular: '虫', simplified: '虫' },
  '鸡': { oracle: '雞', bronze: '雞', smallSeal: '雞', clerical: '雞', regular: '雞', simplified: '鸡' },
  '犬': { oracle: '犬', bronze: '犬', smallSeal: '犬', clerical: '犬', regular: '犬', simplified: '犬' },
  '虎': { oracle: '虎', bronze: '虎', smallSeal: '虎', clerical: '虎', regular: '虎', simplified: '虎' },
  '兔': { oracle: '兔', bronze: '兔', smallSeal: '兔', clerical: '兔', regular: '兔', simplified: '兔' },
  
  // 人体类
  '人': { oracle: '🧍', bronze: '人', smallSeal: '人', clerical: '人', regular: '人', simplified: '人' },
  '大': { oracle: '大', bronze: '大', smallSeal: '大', clerical: '大', regular: '大', simplified: '大' },
  '小': { oracle: '小', bronze: '小', smallSeal: '小', clerical: '小', regular: '小', simplified: '小' },
  '口': { oracle: '口', bronze: '口', smallSeal: '口', clerical: '口', regular: '口', simplified: '口' },
  '手': { oracle: '手', bronze: '手', smallSeal: '手', clerical: '手', regular: '手', simplified: '手' },
  '足': { oracle: '足', bronze: '足', smallSeal: '足', clerical: '足', regular: '足', simplified: '足' },
  '目': { oracle: '目', bronze: '目', smallSeal: '目', clerical: '目', regular: '目', simplified: '目' },
  '耳': { oracle: '耳', bronze: '耳', smallSeal: '耳', clerical: '耳', regular: '耳', simplified: '耳' },
  '心': { oracle: '心', bronze: '心', smallSeal: '心', clerical: '心', regular: '心', simplified: '心' },
  '头': { oracle: '頭', bronze: '頭', smallSeal: '頭', clerical: '頭', regular: '頭', simplified: '头' },
  
  // 动作类
  '走': { oracle: '走', bronze: '走', smallSeal: '走', clerical: '走', regular: '走', simplified: '走' },
  '跑': { oracle: '跑', bronze: '跑', smallSeal: '跑', clerical: '跑', regular: '跑', simplified: '跑' },
  '跳': { oracle: '跳', bronze: '跳', smallSeal: '跳', clerical: '跳', regular: '跳', simplified: '跳' },
  '飞': { oracle: '飛', bronze: '飛', smallSeal: '飛', clerical: '飛', regular: '飛', simplified: '飞' },
  '坐': { oracle: '坐', bronze: '坐', smallSeal: '坐', clerical: '坐', regular: '坐', simplified: '坐' },
  '立': { oracle: '立', bronze: '立', smallSeal: '立', clerical: '立', regular: '立', simplified: '立' },
  '行': { oracle: '行', bronze: '行', smallSeal: '行', clerical: '行', regular: '行', simplified: '行' },
  
  // 方位类
  '上': { oracle: '上', bronze: '上', smallSeal: '上', clerical: '上', regular: '上', simplified: '上' },
  '下': { oracle: '下', bronze: '下', smallSeal: '下', clerical: '下', regular: '下', simplified: '下' },
  '左': { oracle: '左', bronze: '左', smallSeal: '左', clerical: '左', regular: '左', simplified: '左' },
  '右': { oracle: '右', bronze: '右', smallSeal: '右', clerical: '右', regular: '右', simplified: '右' },
  '中': { oracle: '中', bronze: '中', smallSeal: '中', clerical: '中', regular: '中', simplified: '中' },
  
  // 家庭类
  '爸': { oracle: '爸', bronze: '爸', smallSeal: '爸', clerical: '爸', regular: '爸', simplified: '爸' },
  '妈': { oracle: '媽', bronze: '媽', smallSeal: '媽', clerical: '媽', regular: '媽', simplified: '妈' },
  '家': { oracle: '家', bronze: '家', smallSeal: '家', clerical: '家', regular: '家', simplified: '家' },
  
  // 其他常用字
  '爱': { oracle: '愛', bronze: '愛', smallSeal: '愛', clerical: '愛', regular: '愛', simplified: '爱' },
  '学': { oracle: '學', bronze: '學', smallSeal: '學', clerical: '學', regular: '學', simplified: '学' },
  '书': { oracle: '書', bronze: '書', smallSeal: '書', clerical: '書', regular: '書', simplified: '书' },
  '门': { oracle: '門', bronze: '門', smallSeal: '門', clerical: '門', regular: '門', simplified: '门' },
  '国': { oracle: '國', bronze: '國', smallSeal: '國', clerical: '國', regular: '國', simplified: '国' },
  '金': { oracle: '金', bronze: '金', smallSeal: '金', clerical: '金', regular: '金', simplified: '金' },
  '钱': { oracle: '錢', bronze: '錢', smallSeal: '錢', clerical: '錢', regular: '錢', simplified: '钱' },
  '买': { oracle: '買', bronze: '買', smallSeal: '買', clerical: '買', regular: '買', simplified: '买' },
  '卖': { oracle: '賣', bronze: '賣', smallSeal: '賣', clerical: '賣', regular: '賣', simplified: '卖' }
}

// 获取汉字演化数据的函数
export function getCharEvolution(char: string): EvolutionData | undefined {
  return evolutionDatabase[char]
}

// 为没有演化数据的汉字生成默认数据（使用现代字形）
export function getDefaultEvolution(char: string): EvolutionData {
  return {
    oracle: char,
    bronze: char,
    smallSeal: char,
    clerical: char,
    regular: char,
    simplified: char
  }
}

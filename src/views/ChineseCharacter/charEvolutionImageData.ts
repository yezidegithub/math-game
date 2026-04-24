// 汉字演化图片数据
// 使用汉典网 (zdic.net) 的图片资源
// 图片 URL 格式：https://www.zdic.net/ts/字.png (甲骨文)、https://www.zdic.net/ts/字_j.png (金文) 等

import type { EvolutionData } from './charEvolutionData'

// 常见汉字的演化图片数据（使用汉典网图片）
export const evolutionImageDatabase: Record<string, EvolutionData> = {
  // 数字类
  '一': {
    oracle: { text: '一', image: 'https://www.zdic.net/ts/一_1.png' },
    bronze: { text: '一', image: 'https://www.zdic.net/ts/一_2.png' },
    smallSeal: { text: '一', image: 'https://www.zdic.net/ts/一_3.png' },
    clerical: { text: '一', image: 'https://www.zdic.net/ts/一_4.png' },
    regular: { text: '一', image: 'https://www.zdic.net/ts/一_5.png' },
    simplified: '一'
  },
  '二': {
    oracle: { text: '二', image: 'https://www.zdic.net/ts/二_1.png' },
    bronze: { text: '二', image: 'https://www.zdic.net/ts/二_2.png' },
    smallSeal: { text: '二', image: 'https://www.zdic.net/ts/二_3.png' },
    clerical: { text: '二', image: 'https://www.zdic.net/ts/二_4.png' },
    regular: { text: '二', image: 'https://www.zdic.net/ts/二_5.png' },
    simplified: '二'
  },
  '三': {
    oracle: { text: '三', image: 'https://www.zdic.net/ts/三_1.png' },
    bronze: { text: '三', image: 'https://www.zdic.net/ts/三_2.png' },
    smallSeal: { text: '三', image: 'https://www.zdic.net/ts/三_3.png' },
    clerical: { text: '三', image: 'https://www.zdic.net/ts/三_4.png' },
    regular: { text: '三', image: 'https://www.zdic.net/ts/三_5.png' },
    simplified: '三'
  },
  '四': {
    oracle: { text: '亖', image: 'https://www.zdic.net/ts/四_1.png' },
    bronze: { text: '四', image: 'https://www.zdic.net/ts/四_2.png' },
    smallSeal: { text: '四', image: 'https://www.zdic.net/ts/四_3.png' },
    clerical: { text: '四', image: 'https://www.zdic.net/ts/四_4.png' },
    regular: { text: '四', image: 'https://www.zdic.net/ts/四_5.png' },
    simplified: '四'
  },
  '五': {
    oracle: { text: 'X', image: 'https://www.zdic.net/ts/五_1.png' },
    bronze: { text: '五', image: 'https://www.zdic.net/ts/五_2.png' },
    smallSeal: { text: '五', image: 'https://www.zdic.net/ts/五_3.png' },
    clerical: { text: '五', image: 'https://www.zdic.net/ts/五_4.png' },
    regular: { text: '五', image: 'https://www.zdic.net/ts/五_5.png' },
    simplified: '五'
  },
  '六': {
    oracle: { text: '亠', image: 'https://www.zdic.net/ts/六_1.png' },
    bronze: { text: '六', image: 'https://www.zdic.net/ts/六_2.png' },
    smallSeal: { text: '六', image: 'https://www.zdic.net/ts/六_3.png' },
    clerical: { text: '六', image: 'https://www.zdic.net/ts/六_4.png' },
    regular: { text: '六', image: 'https://www.zdic.net/ts/六_5.png' },
    simplified: '六'
  },
  '七': {
    oracle: { text: '十', image: 'https://www.zdic.net/ts/七_1.png' },
    bronze: { text: '七', image: 'https://www.zdic.net/ts/七_2.png' },
    smallSeal: { text: '七', image: 'https://www.zdic.net/ts/七_3.png' },
    clerical: { text: '七', image: 'https://www.zdic.net/ts/七_4.png' },
    regular: { text: '七', image: 'https://www.zdic.net/ts/七_5.png' },
    simplified: '七'
  },
  '八': {
    oracle: { text: '八', image: 'https://www.zdic.net/ts/八_1.png' },
    bronze: { text: '八', image: 'https://www.zdic.net/ts/八_2.png' },
    smallSeal: { text: '八', image: 'https://www.zdic.net/ts/八_3.png' },
    clerical: { text: '八', image: 'https://www.zdic.net/ts/八_4.png' },
    regular: { text: '八', image: 'https://www.zdic.net/ts/八_5.png' },
    simplified: '八'
  },
  '九': {
    oracle: { text: '九', image: 'https://www.zdic.net/ts/九_1.png' },
    bronze: { text: '九', image: 'https://www.zdic.net/ts/九_2.png' },
    smallSeal: { text: '九', image: 'https://www.zdic.net/ts/九_3.png' },
    clerical: { text: '九', image: 'https://www.zdic.net/ts/九_4.png' },
    regular: { text: '九', image: 'https://www.zdic.net/ts/九_5.png' },
    simplified: '九'
  },
  '十': {
    oracle: { text: '十', image: 'https://www.zdic.net/ts/十_1.png' },
    bronze: { text: '十', image: 'https://www.zdic.net/ts/十_2.png' },
    smallSeal: { text: '十', image: 'https://www.zdic.net/ts/十_3.png' },
    clerical: { text: '十', image: 'https://www.zdic.net/ts/十_4.png' },
    regular: { text: '十', image: 'https://www.zdic.net/ts/十_5.png' },
    simplified: '十'
  },
  
  // 自然类
  '日': {
    oracle: { text: '⊙', image: 'https://www.zdic.net/ts/日_1.png' },
    bronze: { text: '日', image: 'https://www.zdic.net/ts/日_2.png' },
    smallSeal: { text: '日', image: 'https://www.zdic.net/ts/日_3.png' },
    clerical: { text: '日', image: 'https://www.zdic.net/ts/日_4.png' },
    regular: { text: '日', image: 'https://www.zdic.net/ts/日_5.png' },
    simplified: '日'
  },
  '月': {
    oracle: { text: '🌙', image: 'https://www.zdic.net/ts/月_1.png' },
    bronze: { text: '月', image: 'https://www.zdic.net/ts/月_2.png' },
    smallSeal: { text: '月', image: 'https://www.zdic.net/ts/月_3.png' },
    clerical: { text: '月', image: 'https://www.zdic.net/ts/月_4.png' },
    regular: { text: '月', image: 'https://www.zdic.net/ts/月_5.png' },
    simplified: '月'
  },
  '水': {
    oracle: { text: '💧', image: 'https://www.zdic.net/ts/水_1.png' },
    bronze: { text: '水', image: 'https://www.zdic.net/ts/水_2.png' },
    smallSeal: { text: '水', image: 'https://www.zdic.net/ts/水_3.png' },
    clerical: { text: '水', image: 'https://www.zdic.net/ts/水_4.png' },
    regular: { text: '水', image: 'https://www.zdic.net/ts/水_5.png' },
    simplified: '水'
  },
  '火': {
    oracle: { text: '🔥', image: 'https://www.zdic.net/ts/火_1.png' },
    bronze: { text: '火', image: 'https://www.zdic.net/ts/火_2.png' },
    smallSeal: { text: '火', image: 'https://www.zdic.net/ts/火_3.png' },
    clerical: { text: '火', image: 'https://www.zdic.net/ts/火_4.png' },
    regular: { text: '火', image: 'https://www.zdic.net/ts/火_5.png' },
    simplified: '火'
  },
  '山': {
    oracle: { text: '⛰️', image: 'https://www.zdic.net/ts/山_1.png' },
    bronze: { text: '山', image: 'https://www.zdic.net/ts/山_2.png' },
    smallSeal: { text: '山', image: 'https://www.zdic.net/ts/山_3.png' },
    clerical: { text: '山', image: 'https://www.zdic.net/ts/山_4.png' },
    regular: { text: '山', image: 'https://www.zdic.net/ts/山_5.png' },
    simplified: '山'
  },
  '石': {
    oracle: { text: '石', image: 'https://www.zdic.net/ts/石_1.png' },
    bronze: { text: '石', image: 'https://www.zdic.net/ts/石_2.png' },
    smallSeal: { text: '石', image: 'https://www.zdic.net/ts/石_3.png' },
    clerical: { text: '石', image: 'https://www.zdic.net/ts/石_4.png' },
    regular: { text: '石', image: 'https://www.zdic.net/ts/石_5.png' },
    simplified: '石'
  },
  '田': {
    oracle: { text: '田', image: 'https://www.zdic.net/ts/田_1.png' },
    bronze: { text: '田', image: 'https://www.zdic.net/ts/田_2.png' },
    smallSeal: { text: '田', image: 'https://www.zdic.net/ts/田_3.png' },
    clerical: { text: '田', image: 'https://www.zdic.net/ts/田_4.png' },
    regular: { text: '田', image: 'https://www.zdic.net/ts/田_5.png' },
    simplified: '田'
  },
  '土': {
    oracle: { text: '土', image: 'https://www.zdic.net/ts/土_1.png' },
    bronze: { text: '土', image: 'https://www.zdic.net/ts/土_2.png' },
    smallSeal: { text: '土', image: 'https://www.zdic.net/ts/土_3.png' },
    clerical: { text: '土', image: 'https://www.zdic.net/ts/土_4.png' },
    regular: { text: '土', image: 'https://www.zdic.net/ts/土_5.png' },
    simplified: '土'
  },
  '地': {
    oracle: { text: '地', image: 'https://www.zdic.net/ts/地_1.png' },
    bronze: { text: '地', image: 'https://www.zdic.net/ts/地_2.png' },
    smallSeal: { text: '地', image: 'https://www.zdic.net/ts/地_3.png' },
    clerical: { text: '地', image: 'https://www.zdic.net/ts/地_4.png' },
    regular: { text: '地', image: 'https://www.zdic.net/ts/地_5.png' },
    simplified: '地'
  },
  '云': {
    oracle: { text: '云', image: 'https://www.zdic.net/ts/云_1.png' },
    bronze: { text: '雲', image: 'https://www.zdic.net/ts/云_2.png' },
    smallSeal: { text: '雲', image: 'https://www.zdic.net/ts/云_3.png' },
    clerical: { text: '雲', image: 'https://www.zdic.net/ts/云_4.png' },
    regular: { text: '雲', image: 'https://www.zdic.net/ts/云_5.png' },
    simplified: '云'
  },
  '雨': {
    oracle: { text: '雨', image: 'https://www.zdic.net/ts/雨_1.png' },
    bronze: { text: '雨', image: 'https://www.zdic.net/ts/雨_2.png' },
    smallSeal: { text: '雨', image: 'https://www.zdic.net/ts/雨_3.png' },
    clerical: { text: '雨', image: 'https://www.zdic.net/ts/雨_4.png' },
    regular: { text: '雨', image: 'https://www.zdic.net/ts/雨_5.png' },
    simplified: '雨'
  },
  '雪': {
    oracle: { text: '雪', image: 'https://www.zdic.net/ts/雪_1.png' },
    bronze: { text: '雪', image: 'https://www.zdic.net/ts/雪_2.png' },
    smallSeal: { text: '雪', image: 'https://www.zdic.net/ts/雪_3.png' },
    clerical: { text: '雪', image: 'https://www.zdic.net/ts/雪_4.png' },
    regular: { text: '雪', image: 'https://www.zdic.net/ts/雪_5.png' },
    simplified: '雪'
  },
  '风': {
    oracle: { text: '風', image: 'https://www.zdic.net/ts/风_1.png' },
    bronze: { text: '風', image: 'https://www.zdic.net/ts/风_2.png' },
    smallSeal: { text: '風', image: 'https://www.zdic.net/ts/风_3.png' },
    clerical: { text: '風', image: 'https://www.zdic.net/ts/风_4.png' },
    regular: { text: '風', image: 'https://www.zdic.net/ts/风_5.png' },
    simplified: '风'
  },
  
  // 植物类
  '木': {
    oracle: { text: '🌳', image: 'https://www.zdic.net/ts/木_1.png' },
    bronze: { text: '木', image: 'https://www.zdic.net/ts/木_2.png' },
    smallSeal: { text: '木', image: 'https://www.zdic.net/ts/木_3.png' },
    clerical: { text: '木', image: 'https://www.zdic.net/ts/木_4.png' },
    regular: { text: '木', image: 'https://www.zdic.net/ts/木_5.png' },
    simplified: '木'
  },
  '林': {
    oracle: { text: '林', image: 'https://www.zdic.net/ts/林_1.png' },
    bronze: { text: '林', image: 'https://www.zdic.net/ts/林_2.png' },
    smallSeal: { text: '林', image: 'https://www.zdic.net/ts/林_3.png' },
    clerical: { text: '林', image: 'https://www.zdic.net/ts/林_4.png' },
    regular: { text: '林', image: 'https://www.zdic.net/ts/林_5.png' },
    simplified: '林'
  },
  '森': {
    oracle: { text: '森', image: 'https://www.zdic.net/ts/森_1.png' },
    bronze: { text: '森', image: 'https://www.zdic.net/ts/森_2.png' },
    smallSeal: { text: '森', image: 'https://www.zdic.net/ts/森_3.png' },
    clerical: { text: '森', image: 'https://www.zdic.net/ts/森_4.png' },
    regular: { text: '森', image: 'https://www.zdic.net/ts/森_5.png' },
    simplified: '森'
  },
  '花': {
    oracle: { text: '花', image: 'https://www.zdic.net/ts/花_1.png' },
    bronze: { text: '花', image: 'https://www.zdic.net/ts/花_2.png' },
    smallSeal: { text: '花', image: 'https://www.zdic.net/ts/花_3.png' },
    clerical: { text: '花', image: 'https://www.zdic.net/ts/花_4.png' },
    regular: { text: '花', image: 'https://www.zdic.net/ts/花_5.png' },
    simplified: '花'
  },
  '草': {
    oracle: { text: '草', image: 'https://www.zdic.net/ts/草_1.png' },
    bronze: { text: '草', image: 'https://www.zdic.net/ts/草_2.png' },
    smallSeal: { text: '草', image: 'https://www.zdic.net/ts/草_3.png' },
    clerical: { text: '草', image: 'https://www.zdic.net/ts/草_4.png' },
    regular: { text: '草', image: 'https://www.zdic.net/ts/草_5.png' },
    simplified: '草'
  },
  '叶': {
    oracle: { text: '葉', image: 'https://www.zdic.net/ts/叶_1.png' },
    bronze: { text: '葉', image: 'https://www.zdic.net/ts/叶_2.png' },
    smallSeal: { text: '葉', image: 'https://www.zdic.net/ts/叶_3.png' },
    clerical: { text: '葉', image: 'https://www.zdic.net/ts/叶_4.png' },
    regular: { text: '葉', image: 'https://www.zdic.net/ts/叶_5.png' },
    simplified: '叶'
  },
  '果': {
    oracle: { text: '果', image: 'https://www.zdic.net/ts/果_1.png' },
    bronze: { text: '果', image: 'https://www.zdic.net/ts/果_2.png' },
    smallSeal: { text: '果', image: 'https://www.zdic.net/ts/果_3.png' },
    clerical: { text: '果', image: 'https://www.zdic.net/ts/果_4.png' },
    regular: { text: '果', image: 'https://www.zdic.net/ts/果_5.png' },
    simplified: '果'
  },
  '禾': {
    oracle: { text: '禾', image: 'https://www.zdic.net/ts/禾_1.png' },
    bronze: { text: '禾', image: 'https://www.zdic.net/ts/禾_2.png' },
    smallSeal: { text: '禾', image: 'https://www.zdic.net/ts/禾_3.png' },
    clerical: { text: '禾', image: 'https://www.zdic.net/ts/禾_4.png' },
    regular: { text: '禾', image: 'https://www.zdic.net/ts/禾_5.png' },
    simplified: '禾'
  },
  '竹': {
    oracle: { text: '竹', image: 'https://www.zdic.net/ts/竹_1.png' },
    bronze: { text: '竹', image: 'https://www.zdic.net/ts/竹_2.png' },
    smallSeal: { text: '竹', image: 'https://www.zdic.net/ts/竹_3.png' },
    clerical: { text: '竹', image: 'https://www.zdic.net/ts/竹_4.png' },
    regular: { text: '竹', image: 'https://www.zdic.net/ts/竹_5.png' },
    simplified: '竹'
  },
  
  // 动物类
  '马': {
    oracle: { text: '🐴', image: 'https://www.zdic.net/ts/马_1.png' },
    bronze: { text: '馬', image: 'https://www.zdic.net/ts/马_2.png' },
    smallSeal: { text: '馬', image: 'https://www.zdic.net/ts/马_3.png' },
    clerical: { text: '馬', image: 'https://www.zdic.net/ts/马_4.png' },
    regular: { text: '馬', image: 'https://www.zdic.net/ts/马_5.png' },
    simplified: '马'
  },
  '牛': {
    oracle: { text: '牛', image: 'https://www.zdic.net/ts/牛_1.png' },
    bronze: { text: '牛', image: 'https://www.zdic.net/ts/牛_2.png' },
    smallSeal: { text: '牛', image: 'https://www.zdic.net/ts/牛_3.png' },
    clerical: { text: '牛', image: 'https://www.zdic.net/ts/牛_4.png' },
    regular: { text: '牛', image: 'https://www.zdic.net/ts/牛_5.png' },
    simplified: '牛'
  },
  '羊': {
    oracle: { text: '羊', image: 'https://www.zdic.net/ts/羊_1.png' },
    bronze: { text: '羊', image: 'https://www.zdic.net/ts/羊_2.png' },
    smallSeal: { text: '羊', image: 'https://www.zdic.net/ts/羊_3.png' },
    clerical: { text: '羊', image: 'https://www.zdic.net/ts/羊_4.png' },
    regular: { text: '羊', image: 'https://www.zdic.net/ts/羊_5.png' },
    simplified: '羊'
  },
  '鸟': {
    oracle: { text: '鳥', image: 'https://www.zdic.net/ts/鸟_1.png' },
    bronze: { text: '鳥', image: 'https://www.zdic.net/ts/鸟_2.png' },
    smallSeal: { text: '鳥', image: 'https://www.zdic.net/ts/鸟_3.png' },
    clerical: { text: '鳥', image: 'https://www.zdic.net/ts/鸟_4.png' },
    regular: { text: '鳥', image: 'https://www.zdic.net/ts/鸟_5.png' },
    simplified: '鸟'
  },
  '鱼': {
    oracle: { text: '魚', image: 'https://www.zdic.net/ts/鱼_1.png' },
    bronze: { text: '魚', image: 'https://www.zdic.net/ts/鱼_2.png' },
    smallSeal: { text: '魚', image: 'https://www.zdic.net/ts/鱼_3.png' },
    clerical: { text: '魚', image: 'https://www.zdic.net/ts/鱼_4.png' },
    regular: { text: '魚', image: 'https://www.zdic.net/ts/鱼_5.png' },
    simplified: '鱼'
  },
  '虫': {
    oracle: { text: '虫', image: 'https://www.zdic.net/ts/虫_1.png' },
    bronze: { text: '虫', image: 'https://www.zdic.net/ts/虫_2.png' },
    smallSeal: { text: '虫', image: 'https://www.zdic.net/ts/虫_3.png' },
    clerical: { text: '虫', image: 'https://www.zdic.net/ts/虫_4.png' },
    regular: { text: '虫', image: 'https://www.zdic.net/ts/虫_5.png' },
    simplified: '虫'
  },
  '鸡': {
    oracle: { text: '雞', image: 'https://www.zdic.net/ts/鸡_1.png' },
    bronze: { text: '雞', image: 'https://www.zdic.net/ts/鸡_2.png' },
    smallSeal: { text: '雞', image: 'https://www.zdic.net/ts/鸡_3.png' },
    clerical: { text: '雞', image: 'https://www.zdic.net/ts/鸡_4.png' },
    regular: { text: '雞', image: 'https://www.zdic.net/ts/鸡_5.png' },
    simplified: '鸡'
  },
  '犬': {
    oracle: { text: '犬', image: 'https://www.zdic.net/ts/犬_1.png' },
    bronze: { text: '犬', image: 'https://www.zdic.net/ts/犬_2.png' },
    smallSeal: { text: '犬', image: 'https://www.zdic.net/ts/犬_3.png' },
    clerical: { text: '犬', image: 'https://www.zdic.net/ts/犬_4.png' },
    regular: { text: '犬', image: 'https://www.zdic.net/ts/犬_5.png' },
    simplified: '犬'
  },
  '虎': {
    oracle: { text: '虎', image: 'https://www.zdic.net/ts/虎_1.png' },
    bronze: { text: '虎', image: 'https://www.zdic.net/ts/虎_2.png' },
    smallSeal: { text: '虎', image: 'https://www.zdic.net/ts/虎_3.png' },
    clerical: { text: '虎', image: 'https://www.zdic.net/ts/虎_4.png' },
    regular: { text: '虎', image: 'https://www.zdic.net/ts/虎_5.png' },
    simplified: '虎'
  },
  '兔': {
    oracle: { text: '兔', image: 'https://www.zdic.net/ts/兔_1.png' },
    bronze: { text: '兔', image: 'https://www.zdic.net/ts/兔_2.png' },
    smallSeal: { text: '兔', image: 'https://www.zdic.net/ts/兔_3.png' },
    clerical: { text: '兔', image: 'https://www.zdic.net/ts/兔_4.png' },
    regular: { text: '兔', image: 'https://www.zdic.net/ts/兔_5.png' },
    simplified: '兔'
  },
  
  // 人体类
  '人': {
    oracle: { text: '🧍', image: 'https://www.zdic.net/ts/人_1.png' },
    bronze: { text: '人', image: 'https://www.zdic.net/ts/人_2.png' },
    smallSeal: { text: '人', image: 'https://www.zdic.net/ts/人_3.png' },
    clerical: { text: '人', image: 'https://www.zdic.net/ts/人_4.png' },
    regular: { text: '人', image: 'https://www.zdic.net/ts/人_5.png' },
    simplified: '人'
  },
  '大': {
    oracle: { text: '大', image: 'https://www.zdic.net/ts/大_1.png' },
    bronze: { text: '大', image: 'https://www.zdic.net/ts/大_2.png' },
    smallSeal: { text: '大', image: 'https://www.zdic.net/ts/大_3.png' },
    clerical: { text: '大', image: 'https://www.zdic.net/ts/大_4.png' },
    regular: { text: '大', image: 'https://www.zdic.net/ts/大_5.png' },
    simplified: '大'
  },
  '小': {
    oracle: { text: '小', image: 'https://www.zdic.net/ts/小_1.png' },
    bronze: { text: '小', image: 'https://www.zdic.net/ts/小_2.png' },
    smallSeal: { text: '小', image: 'https://www.zdic.net/ts/小_3.png' },
    clerical: { text: '小', image: 'https://www.zdic.net/ts/小_4.png' },
    regular: { text: '小', image: 'https://www.zdic.net/ts/小_5.png' },
    simplified: '小'
  },
  '口': {
    oracle: { text: '口', image: 'https://www.zdic.net/ts/口_1.png' },
    bronze: { text: '口', image: 'https://www.zdic.net/ts/口_2.png' },
    smallSeal: { text: '口', image: 'https://www.zdic.net/ts/口_3.png' },
    clerical: { text: '口', image: 'https://www.zdic.net/ts/口_4.png' },
    regular: { text: '口', image: 'https://www.zdic.net/ts/口_5.png' },
    simplified: '口'
  },
  '手': {
    oracle: { text: '手', image: 'https://www.zdic.net/ts/手_1.png' },
    bronze: { text: '手', image: 'https://www.zdic.net/ts/手_2.png' },
    smallSeal: { text: '手', image: 'https://www.zdic.net/ts/手_3.png' },
    clerical: { text: '手', image: 'https://www.zdic.net/ts/手_4.png' },
    regular: { text: '手', image: 'https://www.zdic.net/ts/手_5.png' },
    simplified: '手'
  },
  '足': {
    oracle: { text: '足', image: 'https://www.zdic.net/ts/足_1.png' },
    bronze: { text: '足', image: 'https://www.zdic.net/ts/足_2.png' },
    smallSeal: { text: '足', image: 'https://www.zdic.net/ts/足_3.png' },
    clerical: { text: '足', image: 'https://www.zdic.net/ts/足_4.png' },
    regular: { text: '足', image: 'https://www.zdic.net/ts/足_5.png' },
    simplified: '足'
  },
  '目': {
    oracle: { text: '目', image: 'https://www.zdic.net/ts/目_1.png' },
    bronze: { text: '目', image: 'https://www.zdic.net/ts/目_2.png' },
    smallSeal: { text: '目', image: 'https://www.zdic.net/ts/目_3.png' },
    clerical: { text: '目', image: 'https://www.zdic.net/ts/目_4.png' },
    regular: { text: '目', image: 'https://www.zdic.net/ts/目_5.png' },
    simplified: '目'
  },
  '耳': {
    oracle: { text: '耳', image: 'https://www.zdic.net/ts/耳_1.png' },
    bronze: { text: '耳', image: 'https://www.zdic.net/ts/耳_2.png' },
    smallSeal: { text: '耳', image: 'https://www.zdic.net/ts/耳_3.png' },
    clerical: { text: '耳', image: 'https://www.zdic.net/ts/耳_4.png' },
    regular: { text: '耳', image: 'https://www.zdic.net/ts/耳_5.png' },
    simplified: '耳'
  },
  '心': {
    oracle: { text: '心', image: 'https://www.zdic.net/ts/心_1.png' },
    bronze: { text: '心', image: 'https://www.zdic.net/ts/心_2.png' },
    smallSeal: { text: '心', image: 'https://www.zdic.net/ts/心_3.png' },
    clerical: { text: '心', image: 'https://www.zdic.net/ts/心_4.png' },
    regular: { text: '心', image: 'https://www.zdic.net/ts/心_5.png' },
    simplified: '心'
  },
  '头': {
    oracle: { text: '頭', image: 'https://www.zdic.net/ts/头_1.png' },
    bronze: { text: '頭', image: 'https://www.zdic.net/ts/头_2.png' },
    smallSeal: { text: '頭', image: 'https://www.zdic.net/ts/头_3.png' },
    clerical: { text: '頭', image: 'https://www.zdic.net/ts/头_4.png' },
    regular: { text: '頭', image: 'https://www.zdic.net/ts/头_5.png' },
    simplified: '头'
  },
  
  // 动作类
  '走': {
    oracle: { text: '走', image: 'https://www.zdic.net/ts/走_1.png' },
    bronze: { text: '走', image: 'https://www.zdic.net/ts/走_2.png' },
    smallSeal: { text: '走', image: 'https://www.zdic.net/ts/走_3.png' },
    clerical: { text: '走', image: 'https://www.zdic.net/ts/走_4.png' },
    regular: { text: '走', image: 'https://www.zdic.net/ts/走_5.png' },
    simplified: '走'
  },
  '跑': {
    oracle: { text: '跑', image: 'https://www.zdic.net/ts/跑_1.png' },
    bronze: { text: '跑', image: 'https://www.zdic.net/ts/跑_2.png' },
    smallSeal: { text: '跑', image: 'https://www.zdic.net/ts/跑_3.png' },
    clerical: { text: '跑', image: 'https://www.zdic.net/ts/跑_4.png' },
    regular: { text: '跑', image: 'https://www.zdic.net/ts/跑_5.png' },
    simplified: '跑'
  },
  '跳': {
    oracle: { text: '跳', image: 'https://www.zdic.net/ts/跳_1.png' },
    bronze: { text: '跳', image: 'https://www.zdic.net/ts/跳_2.png' },
    smallSeal: { text: '跳', image: 'https://www.zdic.net/ts/跳_3.png' },
    clerical: { text: '跳', image: 'https://www.zdic.net/ts/跳_4.png' },
    regular: { text: '跳', image: 'https://www.zdic.net/ts/跳_5.png' },
    simplified: '跳'
  },
  '飞': {
    oracle: { text: '飛', image: 'https://www.zdic.net/ts/飞_1.png' },
    bronze: { text: '飛', image: 'https://www.zdic.net/ts/飞_2.png' },
    smallSeal: { text: '飛', image: 'https://www.zdic.net/ts/飞_3.png' },
    clerical: { text: '飛', image: 'https://www.zdic.net/ts/飞_4.png' },
    regular: { text: '飛', image: 'https://www.zdic.net/ts/飞_5.png' },
    simplified: '飞'
  },
  '坐': {
    oracle: { text: '坐', image: 'https://www.zdic.net/ts/坐_1.png' },
    bronze: { text: '坐', image: 'https://www.zdic.net/ts/坐_2.png' },
    smallSeal: { text: '坐', image: 'https://www.zdic.net/ts/坐_3.png' },
    clerical: { text: '坐', image: 'https://www.zdic.net/ts/坐_4.png' },
    regular: { text: '坐', image: 'https://www.zdic.net/ts/坐_5.png' },
    simplified: '坐'
  },
  '立': {
    oracle: { text: '立', image: 'https://www.zdic.net/ts/立_1.png' },
    bronze: { text: '立', image: 'https://www.zdic.net/ts/立_2.png' },
    smallSeal: { text: '立', image: 'https://www.zdic.net/ts/立_3.png' },
    clerical: { text: '立', image: 'https://www.zdic.net/ts/立_4.png' },
    regular: { text: '立', image: 'https://www.zdic.net/ts/立_5.png' },
    simplified: '立'
  },
  '行': {
    oracle: { text: '行', image: 'https://www.zdic.net/ts/行_1.png' },
    bronze: { text: '行', image: 'https://www.zdic.net/ts/行_2.png' },
    smallSeal: { text: '行', image: 'https://www.zdic.net/ts/行_3.png' },
    clerical: { text: '行', image: 'https://www.zdic.net/ts/行_4.png' },
    regular: { text: '行', image: 'https://www.zdic.net/ts/行_5.png' },
    simplified: '行'
  },
  
  // 方位类
  '上': {
    oracle: { text: '上', image: 'https://www.zdic.net/ts/上_1.png' },
    bronze: { text: '上', image: 'https://www.zdic.net/ts/上_2.png' },
    smallSeal: { text: '上', image: 'https://www.zdic.net/ts/上_3.png' },
    clerical: { text: '上', image: 'https://www.zdic.net/ts/上_4.png' },
    regular: { text: '上', image: 'https://www.zdic.net/ts/上_5.png' },
    simplified: '上'
  },
  '下': {
    oracle: { text: '下', image: 'https://www.zdic.net/ts/下_1.png' },
    bronze: { text: '下', image: 'https://www.zdic.net/ts/下_2.png' },
    smallSeal: { text: '下', image: 'https://www.zdic.net/ts/下_3.png' },
    clerical: { text: '下', image: 'https://www.zdic.net/ts/下_4.png' },
    regular: { text: '下', image: 'https://www.zdic.net/ts/下_5.png' },
    simplified: '下'
  },
  '左': {
    oracle: { text: '左', image: 'https://www.zdic.net/ts/左_1.png' },
    bronze: { text: '左', image: 'https://www.zdic.net/ts/左_2.png' },
    smallSeal: { text: '左', image: 'https://www.zdic.net/ts/左_3.png' },
    clerical: { text: '左', image: 'https://www.zdic.net/ts/左_4.png' },
    regular: { text: '左', image: 'https://www.zdic.net/ts/左_5.png' },
    simplified: '左'
  },
  '右': {
    oracle: { text: '右', image: 'https://www.zdic.net/ts/右_1.png' },
    bronze: { text: '右', image: 'https://www.zdic.net/ts/右_2.png' },
    smallSeal: { text: '右', image: 'https://www.zdic.net/ts/右_3.png' },
    clerical: { text: '右', image: 'https://www.zdic.net/ts/右_4.png' },
    regular: { text: '右', image: 'https://www.zdic.net/ts/右_5.png' },
    simplified: '右'
  },
  '中': {
    oracle: { text: '中', image: 'https://www.zdic.net/ts/中_1.png' },
    bronze: { text: '中', image: 'https://www.zdic.net/ts/中_2.png' },
    smallSeal: { text: '中', image: 'https://www.zdic.net/ts/中_3.png' },
    clerical: { text: '中', image: 'https://www.zdic.net/ts/中_4.png' },
    regular: { text: '中', image: 'https://www.zdic.net/ts/中_5.png' },
    simplified: '中'
  },
  
  // 家庭类
  '爸': {
    oracle: { text: '爸', image: 'https://www.zdic.net/ts/爸_1.png' },
    bronze: { text: '爸', image: 'https://www.zdic.net/ts/爸_2.png' },
    smallSeal: { text: '爸', image: 'https://www.zdic.net/ts/爸_3.png' },
    clerical: { text: '爸', image: 'https://www.zdic.net/ts/爸_4.png' },
    regular: { text: '爸', image: 'https://www.zdic.net/ts/爸_5.png' },
    simplified: '爸'
  },
  '妈': {
    oracle: { text: '媽', image: 'https://www.zdic.net/ts/妈_1.png' },
    bronze: { text: '媽', image: 'https://www.zdic.net/ts/妈_2.png' },
    smallSeal: { text: '媽', image: 'https://www.zdic.net/ts/妈_3.png' },
    clerical: { text: '媽', image: 'https://www.zdic.net/ts/妈_4.png' },
    regular: { text: '媽', image: 'https://www.zdic.net/ts/妈_5.png' },
    simplified: '妈'
  },
  '家': {
    oracle: { text: '家', image: 'https://www.zdic.net/ts/家_1.png' },
    bronze: { text: '家', image: 'https://www.zdic.net/ts/家_2.png' },
    smallSeal: { text: '家', image: 'https://www.zdic.net/ts/家_3.png' },
    clerical: { text: '家', image: 'https://www.zdic.net/ts/家_4.png' },
    regular: { text: '家', image: 'https://www.zdic.net/ts/家_5.png' },
    simplified: '家'
  },
  
  // 其他常用字
  '爱': {
    oracle: { text: '愛', image: 'https://www.zdic.net/ts/爱_1.png' },
    bronze: { text: '愛', image: 'https://www.zdic.net/ts/爱_2.png' },
    smallSeal: { text: '愛', image: 'https://www.zdic.net/ts/爱_3.png' },
    clerical: { text: '愛', image: 'https://www.zdic.net/ts/爱_4.png' },
    regular: { text: '愛', image: 'https://www.zdic.net/ts/爱_5.png' },
    simplified: '爱'
  },
  '学': {
    oracle: { text: '學', image: 'https://www.zdic.net/ts/学_1.png' },
    bronze: { text: '學', image: 'https://www.zdic.net/ts/学_2.png' },
    smallSeal: { text: '學', image: 'https://www.zdic.net/ts/学_3.png' },
    clerical: { text: '學', image: 'https://www.zdic.net/ts/学_4.png' },
    regular: { text: '學', image: 'https://www.zdic.net/ts/学_5.png' },
    simplified: '学'
  },
  '书': {
    oracle: { text: '書', image: 'https://www.zdic.net/ts/书_1.png' },
    bronze: { text: '書', image: 'https://www.zdic.net/ts/书_2.png' },
    smallSeal: { text: '書', image: 'https://www.zdic.net/ts/书_3.png' },
    clerical: { text: '書', image: 'https://www.zdic.net/ts/书_4.png' },
    regular: { text: '書', image: 'https://www.zdic.net/ts/书_5.png' },
    simplified: '书'
  },
  '门': {
    oracle: { text: '門', image: 'https://www.zdic.net/ts/门_1.png' },
    bronze: { text: '門', image: 'https://www.zdic.net/ts/门_2.png' },
    smallSeal: { text: '門', image: 'https://www.zdic.net/ts/门_3.png' },
    clerical: { text: '門', image: 'https://www.zdic.net/ts/门_4.png' },
    regular: { text: '門', image: 'https://www.zdic.net/ts/门_5.png' },
    simplified: '门'
  },
  '国': {
    oracle: { text: '國', image: 'https://www.zdic.net/ts/国_1.png' },
    bronze: { text: '國', image: 'https://www.zdic.net/ts/国_2.png' },
    smallSeal: { text: '國', image: 'https://www.zdic.net/ts/国_3.png' },
    clerical: { text: '國', image: 'https://www.zdic.net/ts/国_4.png' },
    regular: { text: '國', image: 'https://www.zdic.net/ts/国_5.png' },
    simplified: '国'
  },
  '金': {
    oracle: { text: '金', image: 'https://www.zdic.net/ts/金_1.png' },
    bronze: { text: '金', image: 'https://www.zdic.net/ts/金_2.png' },
    smallSeal: { text: '金', image: 'https://www.zdic.net/ts/金_3.png' },
    clerical: { text: '金', image: 'https://www.zdic.net/ts/金_4.png' },
    regular: { text: '金', image: 'https://www.zdic.net/ts/金_5.png' },
    simplified: '金'
  },
  '钱': {
    oracle: { text: '錢', image: 'https://www.zdic.net/ts/钱_1.png' },
    bronze: { text: '錢', image: 'https://www.zdic.net/ts/钱_2.png' },
    smallSeal: { text: '錢', image: 'https://www.zdic.net/ts/钱_3.png' },
    clerical: { text: '錢', image: 'https://www.zdic.net/ts/钱_4.png' },
    regular: { text: '錢', image: 'https://www.zdic.net/ts/钱_5.png' },
    simplified: '钱'
  },
  '买': {
    oracle: { text: '買', image: 'https://www.zdic.net/ts/买_1.png' },
    bronze: { text: '買', image: 'https://www.zdic.net/ts/买_2.png' },
    smallSeal: { text: '買', image: 'https://www.zdic.net/ts/买_3.png' },
    clerical: { text: '買', image: 'https://www.zdic.net/ts/买_4.png' },
    regular: { text: '買', image: 'https://www.zdic.net/ts/买_5.png' },
    simplified: '买'
  },
  '卖': {
    oracle: { text: '賣', image: 'https://www.zdic.net/ts/卖_1.png' },
    bronze: { text: '賣', image: 'https://www.zdic.net/ts/卖_2.png' },
    smallSeal: { text: '賣', image: 'https://www.zdic.net/ts/卖_3.png' },
    clerical: { text: '賣', image: 'https://www.zdic.net/ts/卖_4.png' },
    regular: { text: '賣', image: 'https://www.zdic.net/ts/卖_5.png' },
    simplified: '卖'
  }
}

// 获取汉字演化图片数据的函数
export function getCharEvolutionImage(char: string): EvolutionData | undefined {
  return evolutionImageDatabase[char]
}

#!/bin/bash
# Google Drive 文件下载脚本

files=(
  "14eoe7h42PwYiE17abXj2DQyFK6DHWokz:IMG_1223.JPG"
  "12zgVA_GjCJZ4YiSNmfaHOzPc0pABb3k8:IMG_1229.JPG"
  "1Ro2ATzJmNKQmo-kOgNW-RWcoSsoiB1E2:IMG_1232.JPG"
  "1EGzLxGwL6KtWz_iIUw2OPV6mYELS9DD9:IMG_1233.JPG"
  "18AyEY-fuFyiDzCFPpW1_3xOdA_qQS6dO:IMG_1725.JPG"
  "1Zw_VW1I8o3byIoVzJrAM0OZgXWw0GBVZ:IMG_2037.JPG"
  "1wgIWUgiuY0uq0tj18cJ0oRYWP-gBKsih:IMG_2039.HEIC"
  "10DMUTgVduu4bD89iFr9dNE6OvgwP59ut:IMG_2080.JPG"
  "1HJP5KgFIM0XXPgNBY4qE-s3ehGixlWO7:IMG_2086.HEIC"
  "1HoiwJX2vR1dSTicnm3P6Z256JC9Kdo-O:IMG_2098.HEIC"
  "1Oa1pfPJznNI5TsW_NELyG2Lvn9-yw9s6:IMG_2099.HEIC"
  "18bAlFK6KIESe8iKLz8XJrVqDyVy16al2:IMG_2289.JPG"
  "17FW5FnQd2cPnhhVrbTHWHlfyknkYGP2y:IMG_2292.JPG"
  "1Iwb5EB-llZ1geZrYR2uLh2olrHD-jzIl:IMG_2293.JPG"
  "1rm0DLF2SSCQ2z8oAa8gonpgXG_SfeSY6:IMG_2304.JPG"
  "1LRr27x5s_pKzqsRifcdzvVicELdEc62y:IMG_2341.HEIC"
  "1gR3suGC8_8KpjQ8KhYaBjEu9Qy-uqC_y:IMG_2488.HEIC"
  "1vTw9CbFdQBRmbSA1Kh52UZu-aTOaN61j:IMG_3135.MOV"
)

for item in "${files[@]}"; do
  id=$(echo $item | cut -d: -f1)
  name=$(echo $item | cut -d: -f2)
  echo "下载: $name"
  curl -L -o "$name" "https://drive.google.com/uc?export=download&id=$id" || echo "失败: $name"
done

echo "完成！"

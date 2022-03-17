# task-runner

これは reynato.tokyo のエンジニアが開発した静的ぺーじ納品用のタスクランナーです。
node のバージョンに依存しないように npm scripts で開発されました。

これはあくまでテンプレートです。このコードを用いる時は

```
cd 開発するフォルダ
git pull https://github.com/Reynato/task-runner.git
```

かリポジトリのページで zip をダウンロードしてください。
絶対このリポジトリにプロジェクトをプッシュしないでください。

## node のバージョン

node のバージョンは`v16.14.0`を使用してください。nodenv を使用しているならそのまま使っていただいても大丈夫です。

## 起動方法

`npm install`をしてください。依存解決の記述が出力されますが基本的にはそのままで大丈夫です。
`npm install`が終わったら`npm run dev`でサーバーが動きます。
サーバーが立ち上がると`/dist`に自動で生成されます。
# PHILIP-STEIN

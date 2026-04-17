<template>
  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div>
          <h3>郑爱玩MC</h3>
          <p>
            一个面向郑州大学学生的 Minecraft 社团门户，整合新闻、帮助文档、
            资源下载与社区入口。
          </p>
        </div>

        <div>
          <h4>快速入口</h4>
          <ul>
            <li>
              <a href="https://skin.twinklestars.top/auth/login" target="_blank" rel="noreferrer">
                皮肤站
              </a>
            </li>
            <li>
              <RouterLink to="/downloads">资源下载</RouterLink>
            </li>
            <li>
              <RouterLink to="/docs">帮助文档</RouterLink>
            </li>
            <li>
              <RouterLink to="/news">最新消息</RouterLink>
            </li>
          </ul>
        </div>

        <div>
          <h4>联系我们</h4>
          <p>
            QQ群：
            <a href="https://qm.qq.com/q/t0M14y23GU" target="_blank" rel="noreferrer">
              加入QQ群
            </a>
          </p>
          <p>邮箱：ducklee@zzumc.com</p>
          <p>管理员：大鸭梨</p>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <div class="container">
        © 2026 郑爱玩MC. All rights reserved.
      </div>
    </div>
  </footer>
</template>

<script setup>
</script>
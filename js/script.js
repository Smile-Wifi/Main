    const allAppsData = [
      { href: "pages/root/campusDC/index.html", img: "media/icons/campusDC.png", name: "CampusDC" },
      { href: "pages/root/smileflix/index.php", img: "media/icons/smileflix.png", name: "SmileFlix" },
      { href: "pages/root/documents/index.html", img: "media/icons/wecantilan.png", name: "PublicDoc" },
      { href: "pages/root/gradio/index.html", img: "media/icons/gradio.png", name: "Gradio" },
      { href: "pages/root/karaoke/index.php", img: "media/icons/videoke.png", name: "Karaoke" },
      { href: "pages/root/musify/index.php", img: "media/icons/musify.png", name: "Musify" },
      { href: "pages/root/reeltalk/index.php", img: "media/icons/reeltalk.png", name: "ReelTalk" },
      { href: "pages/root/sports/index.php", img: "media/icons/sports.png", name: "Sports" },
      { href: "pages/root/jollibee/index.html", img: "media/icons/jollibee.png", name: "Jollibee" },
      { href: "pages/root/showtime/index.php", img: "media/icons/showtime.png", name: "Showtime" },
      { href: "pages/root/smiletools/index.html", img: "media/icons/tools.png", name: "SmileTools" },
      { href: "pages/root/dashboard/index.html", img: "media/icons/dashboard.png", name: "Dashboard" },
      { href: "pages/root/freedom/index.html", img: "media/icons/freedom.png", name: "Freedom" },
      { href: "https://en.wikipedia.org/", img: "media/icons/wikipedia.png", name: "Wikipedia", external: true },
      { href: "pages/root/shop/index.html", img: "media/icons/shop2.png", name: "LocalBiz" },
      { href: "pages/root/skits/index.html", img: "media/icons/skits.png", name: "Skits" },
      { href: "pages/root/politics/index.html", img: "media/icons/politics.png", name: "Politics" },
      { href: "pages/root/ebooks/index.html", img: "media/icons/ebooks.png", name: "eBooks" }
    ];

    function showAllApps() {
      const grid = document.getElementById('allAppsGrid');
      grid.innerHTML = allAppsData.map(app => `
        <div class="all-app-item">
          <a href="${app.href}" ${app.external ? 'target="_blank"' : ''}>
            <img src="${app.img}" alt="${app.name}">
            <p>${app.name}</p>
          </a>
        </div>
      `).join('');
      document.getElementById('allAppsOverlay').style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }

    function hideAllApps() {
      document.getElementById('allAppsOverlay').style.display = 'none';
      document.body.style.overflow = '';
    }

    document.addEventListener('DOMContentLoaded', () => {
      // Nav toggle
      const navToggle = document.getElementById('nav-toggle');
      const sideNav = document.getElementById('side-nav');
      navToggle.addEventListener('click', ()=>sideNav.classList.toggle('open'));

      // Slide dots
      const iconWrapper = document.getElementById('iconWrapper');
      const dots = document.querySelectorAll('.dot');

      function updateActiveDot() {
        const slideWidth = iconWrapper.querySelector('.icon-grid').clientWidth;
        const index = Math.round(iconWrapper.scrollLeft / slideWidth);
        dots.forEach(d => d.classList.remove('active'));
        if(dots[index]) dots[index].classList.add('active');
      }

      dots.forEach(dot=>{
        dot.addEventListener('click', ()=> {
          const slideWidth = iconWrapper.querySelector('.icon-grid').clientWidth;
          const index = parseInt(dot.dataset.index);
          iconWrapper.scrollTo({left: index*slideWidth, behavior:'smooth'});
        });
      });

      iconWrapper.addEventListener('scroll', updateActiveDot);

      // All Apps Overlay
      const homeBtn = document.getElementById('homeBtn');
      const closeOverlay = document.getElementById('closeOverlay');

      homeBtn.addEventListener('click', showAllApps);
      closeOverlay.addEventListener('click', hideAllApps);
    });

    // PWA: Service Worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(reg => console.log('SW registered', reg))
          .catch(err => console.error('SW registration failed', err));
      });
    }
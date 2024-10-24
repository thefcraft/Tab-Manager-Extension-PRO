import os
os.chdir('out')
os.mkdir('assets')

with open('index.html', 'r') as f: data = f.read()

theme_pos_start = data.find('<script>')
theme_pos_end = data[theme_pos_start:].find('</script>')+theme_pos_start

theme_js = data[theme_pos_start+len('<script>'):theme_pos_end]
with open('assets/themes.js', 'w') as f: f.write(theme_js)

data = data[:theme_pos_start] + '<script src="assets/themes.js">/* DELETE */' + data[theme_pos_end:]

last_pos_start = data.find('<script>')
main_js = data[last_pos_start+len('<script>'):-len('</script></body></html>')].replace('</script><script>', ';\n')+';'
with open('assets/main.js', 'w') as f: f.write(main_js)

data = data[:last_pos_start] + '<script src="/assets/main.js">/* DELETE */</script></body></html>'
with open('dashboard.html', 'w') as f: f.write(data)
os.remove('index.html')

print('Post-build processing completed from python...')
const cositas = () => {

    $(function() {

        const targetsByFunc = {
            bindBuffer: [
                'ARRAY_BUFFER',
                'COPY_READ_BUFFER',
                'COPY_WRITE_BUFFER',
                'ELEMENT_ARRAY_BUFFER',
                'PIXEL_PACK_BUFFER',
                'PIXEL_UNPACK_BUFFER',
                'TRANSFORM_FEEDBACK_BUFFER',
                'UNIFORM_BUFFER'
            ],
            bufferData: [
                'ARRAY_BUFFER',
                'COPY_READ_BUFFER',
                'COPY_WRITE_BUFFER',
                'ELEMENT_ARRAY_BUFFER',
                'PIXEL_PACK_BUFFER',
                'PIXEL_UNPACK_BUFFER',
                'TRANSFORM_FEEDBACK_BUFFER',
                'UNIFORM_BUFFER'
            ],
            bufferSubData: [
                'ARRAY_BUFFER',
                'COPY_READ_BUFFER',
                'COPY_WRITE_BUFFER',
                'ELEMENT_ARRAY_BUFFER',
                'PIXEL_PACK_BUFFER',
                'PIXEL_UNPACK_BUFFER',
                'TRANSFORM_FEEDBACK_BUFFER',
                'UNIFORM_BUFFER'
            ],
            copyBufferSubData: [
                'ARRAY_BUFFER',
                'COPY_READ_BUFFER',
                'COPY_WRITE_BUFFER',
                'ELEMENT_ARRAY_BUFFER',
                'PIXEL_PACK_BUFFER',
                'PIXEL_UNPACK_BUFFER',
                'TRANSFORM_FEEDBACK_BUFFER',
                'UNIFORM_BUFFER'
            ],
            getBufferParameter: [
                'ARRAY_BUFFER',
                'COPY_READ_BUFFER',
                'COPY_WRITE_BUFFER',
                'ELEMENT_ARRAY_BUFFER',
                'PIXEL_PACK_BUFFER',
                'PIXEL_UNPACK_BUFFER',
                'TRANSFORM_FEEDBACK_BUFFER',
                'UNIFORM_BUFFER'
            ],
            vertexAttribPointer: [
                'ARRAY_BUFFER'
            ],
            drawElements: [
                'ELEMENT_ARRAY_BUFFER'
            ],
            drawElementsInstanced: [
                'ELEMENT_ARRAY_BUFFER'
            ],
            drawRangeElements: [
                'ELEMENT_ARRAY_BUFFER'
            ],
            readPixels: [
                'PIXEL_PACK_BUFFER'
            ],
            compressedTexImage2D: [
                'PIXEL_UNPACK_BUFFER',
                'TEXTURE_2D'
            ],
            compressedTexImage3D: [
                'PIXEL_UNPACK_BUFFER',
                'TEXTURE_3D',
                'TEXTURE_2D_ARRAY'
            ],
            compressedTexSubImage2D: [
                'PIXEL_UNPACK_BUFFER',
                'TEXTURE_2D'
            ],
            compressedTexSubImage3D: [
                'PIXEL_UNPACK_BUFFER',
                'TEXTURE_3D',
                'TEXTURE_2D_ARRAY'
            ],
            texImage2D: [
                'PIXEL_UNPACK_BUFFER',
                'TEXTURE_2D',
                'TEXTURE_CUBE_MAP'
            ],
            texImage3D: [
                'PIXEL_UNPACK_BUFFER',
                'TEXTURE_3D',
                'TEXTURE_2D_ARRAY'
            ],
            texSubImage2D: [
                'PIXEL_UNPACK_BUFFER',
                'TEXTURE_2D'
            ],
            texSubImage3D: [
                'PIXEL_UNPACK_BUFFER',
                'TEXTURE_3D',
                'TEXTURE_2D_ARRAY'
            ],
            bindBufferBase: [
                'TRANSFORM_FEEDBACK_BUFFER',
                'UNIFORM_BUFFER'
            ],
            bindBufferRange: [
                'TRANSFORM_FEEDBACK_BUFFER',
                'UNIFORM_BUFFER'
            ],
            framebufferTexture2D: [
                'GL_FRAMEBUFFER',
                'READ_FRAMEBUFFER',
                'DRAW_FRAMEBUFFER',
                'TEXTURE_2D'
            ],
            bindFramebuffer: [
                'READ_FRAMEBUFFER',
                'DRAW_FRAMEBUFFER'
            ],
            checkFramebufferStatus: [
                'READ_FRAMEBUFFER',
                'DRAW_FRAMEBUFFER'
            ],
            framebufferRenderbuffer: [
                'READ_FRAMEBUFFER',
                'DRAW_FRAMEBUFFER',
                'RENDERBUFFER'
            ],
            framebufferTextureLayer: [
                'READ_FRAMEBUFFER',
                'DRAW_FRAMEBUFFER'
            ],
            invalidateFramebuffer: [
                'READ_FRAMEBUFFER',
                'DRAW_FRAMEBUFFER'
            ],
            invalidateSubFramebuffer: [
                'READ_FRAMEBUFFER',
                'DRAW_FRAMEBUFFER'
            ],
            bindRenderbuffer: [
                'RENDERBUFFER'
            ],
            renderbufferStorage: [
                'RENDERBUFFER'
            ],
            renderbufferStorageMultisample: [
                'RENDERBUFFER'
            ],
            bindTexture: [
                'TEXTURE_2D',
                'TEXTURE_3D',
                'TEXTURE_2D_ARRAY',
                'TEXTURE_CUBE_MAP'
            ],
            copyTexImage2D: [
                'TEXTURE_2D'
            ],
            copyTexSubImage2D: [
                'TEXTURE_2D'
            ],
            generateMipmap: [
                'TEXTURE_2D',
                'TEXTURE_3D',
                'TEXTURE_2D_ARRAY',
                'TEXTURE_CUBE_MAP'
            ],
            getTexParameter: [
                'TEXTURE_2D',
                'TEXTURE_3D',
                'TEXTURE_2D_ARRAY',
                'TEXTURE_CUBE_MAP'
            ],
            texStorage2D: [
                'TEXTURE_2D',
                'TEXTURE_CUBE_MAP'
            ],
            copyTexSubImage3D: [
                'TEXTURE_3D',
                'TEXTURE_2D_ARRAY'
            ],
            texStorage3D: [
                'TEXTURE_3D',
                'TEXTURE_2D_ARRAY'
            ],
            bindTransformFeedback: [
                'TRANSFORM_FEEDBACK'
            ]
        };
        const hiddenTargetFunctions = [
            'vertexAttribPointer',
            'drawElements',
            'drawElementsInstanced',
            'drawRangeElements',
            'readPixels',
        ];

        const funcsByTarget = {};
        for (func of Object.keys(targetsByFunc).sort()) {
            for (target of targetsByFunc[func]) {
                funcsByTarget[target] = funcsByTarget[target] ? ? [];
                funcsByTarget[target].push(func);
            }
        }

        {
            const container = document.createElement('div');
            container.className = 'container target-list';
            document.body.appendChild(container);

            const title1 = document.createElement('h1');
            title1.innerText = 'WebGL targets and their associated functions';
            container.appendChild(title1);

            for (key of Object.keys(funcsByTarget)) {
                const section = document.createElement('div');
                container.appendChild(section);

                const h2 = document.createElement('h2');
                h2.innerText = key;
                section.appendChild(h2);
                const ul = document.createElement('ul');
                section.appendChild(ul)

                for (func of funcsByTarget[key]) {
                    const li = document.createElement('li');
                    li.classList.add(key)
                    if (hiddenTargetFunctions.includes(func)) li.classList.add('special')
                    li.innerText = func;
                    ul.appendChild(li);
                }
                if (funcsByTarget[key].length === 0) {
                    const li = document.createElement('li');
                    li.innerText = '[NONE]';
                    ul.appendChild(li);

                }
            }
        }

        {
            const container = document.createElement('div');
            container.className = 'container function-list';
            document.body.appendChild(container);


            const title = document.createElement('h1');
            title.innerText = 'WebGL functions and their associated targets';
            container.appendChild(title);

            for (key of Object.keys(targetsByFunc)) {
                const section = document.createElement('div');
                container.appendChild(section);

                const h2 = document.createElement('h2');
                h2.innerText = key;
                if (hiddenTargetFunctions.includes(key)) h2.classList.add('special');
                section.appendChild(h2);
                const ul = document.createElement('ul');
                section.appendChild(ul)

                for (func of targetsByFunc[key]) {
                    const li = document.createElement('li');
                    li.classList.add(func)
                    li.innerText = func;
                    ul.appendChild(li);
                }
                if (targetsByFunc[key].length === 0) {
                    const li = document.createElement('li');
                    li.innerText = '[NONE]';
                    ul.appendChild(li);

                }
            }
        }

    });
}